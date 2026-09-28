import { query } from '../config/db.js';

const round2 = (n) => Math.round(n * 100) / 100;

/** Builds all dashboard data for a resolved date range (see config/periods.js). */
export async function getDashboard(r) {
  const range = [r.start, r.end];

  const [summary, previous, byCategory, trend, top, byPayment] = await Promise.all([
    query(
      `SELECT COALESCE(SUM(amount),0) AS total, COUNT(*)::int AS count,
              COALESCE(AVG(amount),0) AS "avgExpense", COALESCE(MAX(amount),0) AS largest
       FROM expenses WHERE spent_on >= $1 AND spent_on < $2`, range),
    query(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE spent_on >= $1 AND spent_on < $2`, [r.prevStart, r.start]),
    query(
      `SELECT c.id, c.name, c.color, SUM(e.amount) AS total, COUNT(*)::int AS count
       FROM expenses e JOIN categories c ON c.id = e.category_id
       WHERE e.spent_on >= $1 AND e.spent_on < $2
       GROUP BY c.id ORDER BY total DESC`, range),
    // generate_series fills empty buckets with 0 so the chart has no gaps
    query(
      `WITH buckets AS (
         SELECT generate_series(date_trunc($3, $1::date), ($2::date - 1), ('1 ' || $3)::interval)::date AS bucket
       )
       SELECT to_char(b.bucket, 'YYYY-MM-DD') AS bucket, COALESCE(SUM(e.amount),0) AS total
       FROM buckets b
       LEFT JOIN expenses e
         ON date_trunc($3, e.spent_on)::date = b.bucket AND e.spent_on >= $1 AND e.spent_on < $2
       GROUP BY b.bucket ORDER BY b.bucket`, [...range, r.bucket]),
    query(
      `SELECT e.id, e.title, e.amount, e.spent_on AS "spentOn", c.name AS category, c.color
       FROM expenses e JOIN categories c ON c.id = e.category_id
       WHERE e.spent_on >= $1 AND e.spent_on < $2
       ORDER BY e.amount DESC LIMIT 5`, range),
    query(
      `SELECT COALESCE(payment_method,'Unspecified') AS method, SUM(amount) AS total
       FROM expenses WHERE spent_on >= $1 AND spent_on < $2
       GROUP BY 1 ORDER BY total DESC`, range),
  ]);

  const s = summary.rows[0];
  const prevTotal = previous.rows[0].total;

  // Days elapsed in the window (up to today for the current period)
  const start = new Date(`${r.start}T00:00:00`);
  const end = r.offset === 0 ? new Date() : new Date(`${r.end}T00:00:00`);
  const days = Math.max(1, Math.ceil((end - start) / 86400000));

  return {
    period: { key: r.key, label: r.label, bucket: r.bucket, start: r.start, end: r.end, offset: r.offset },
    summary: {
      total: s.total,
      count: s.count,
      avgExpense: round2(s.avgExpense),
      largest: s.largest,
      dailyAverage: round2(s.total / days),
      previousTotal: prevTotal,
      changePct: prevTotal > 0 ? Math.round(((s.total - prevTotal) / prevTotal) * 1000) / 10 : null,
    },
    byCategory: byCategory.rows,
    trend: trend.rows,
    topExpenses: top.rows,
    byPayment: byPayment.rows,
  };
}
