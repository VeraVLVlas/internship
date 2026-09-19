import { pool } from './db.js';
import { calculatePartnerDiscount } from '../Разработка ядра бизнес-логики (Расчет скидки)/calculatePartnerDiscount.js';

export async function getPartnersWithDiscount() {
  const query = `
    SELECT
      p.partner_id,
      p.company_name,
      p.inn,
      p.contact_email,
      p.phone,
      p.rating,
      COALESCE(SUM(s.quantity), 0)::int AS total_quantity
    FROM partners p
    LEFT JOIN sales s
      ON s.partner_id = p.partner_id
    GROUP BY
      p.partner_id,
      p.company_name,
      p.inn,
      p.contact_email,
      p.phone,
      p.rating
    ORDER BY
      p.company_name ASC
  `;

  const result = await pool.query(query);

  return result.rows.map((partner) => {
    const totalQuantity = Number(partner.total_quantity ?? 0);

    return {
      ...partner,
      total_quantity: totalQuantity,
      discount: calculatePartnerDiscount(totalQuantity)
    };
  });
}
