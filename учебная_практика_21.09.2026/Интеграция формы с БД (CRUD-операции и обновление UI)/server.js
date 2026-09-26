import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { pool } from '../../учебная_практика_14.09.2026/Интеграция с БД и агрегация данных (SQL + Backend)/db.js';
import { calculatePartnerDiscount } from '../../учебная_практика_14.09.2026/Разработка ядра бизнес-логики (Расчет скидки)/calculatePartnerDiscount.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/partners', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.partner_id,
        p.company_name,
        p.partner_type,
        p.address,
        p.director,
        p.phone,
        p.contact_email,
        p.rating,
        COALESCE(SUM(s.quantity), 0)::int AS total_quantity
      FROM partners p
      LEFT JOIN sales s
        ON s.partner_id = p.partner_id
      GROUP BY
        p.partner_id,
        p.company_name,
        p.partner_type,
        p.address,
        p.director,
        p.phone,
        p.contact_email,
        p.rating
      ORDER BY p.company_name
    `);

    const partners = result.rows.map((partner) => ({
      ...partner,
      discount: calculatePartnerDiscount(partner.total_quantity)
    }));

    res.json(partners);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Не удалось загрузить список партнеров'
    });
  }
});


app.get('/api/partners/:id', async (req, res) => {
  try {
    const partnerId = Number(req.params.id);

    const result = await pool.query(
      `
        SELECT
          partner_id,
          company_name,
          inn,
          partner_type,
          address,
          director,
          phone,
          contact_email,
          rating
        FROM partners
        WHERE partner_id = $1
      `,
      [partnerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Партнер не найден'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Не удалось получить данные партнера'
    });
  }
});


app.post('/api/partners', async (req, res) => {
  try {
    const {
      companyName,
      inn,
      partnerType,
      rating,
      address,
      director,
      phone,
      email
    } = req.body;

    const result = await pool.query(
      `
        INSERT INTO partners (
          company_name,
          inn,
          partner_type,
          rating,
          address,
          director,
          phone,
          contact_email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        companyName,
        inn,
        partnerType,
        rating,
        address,
        director,
        phone,
        email
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Не удалось добавить партнера'
    });
  }
});


app.put('/api/partners/:id', async (req, res) => {
  try {
    const partnerId = Number(req.params.id);

    const partnerExists = await pool.query(
      'SELECT partner_id FROM partners WHERE partner_id = $1',
      [partnerId]
    );

    if (partnerExists.rows.length === 0) {
      return res.status(404).json({
        message: 'Партнер не найден'
      });
    }

    const {
      companyName,
      inn,
      partnerType,
      rating,
      address,
      director,
      phone,
      email
    } = req.body;

    const result = await pool.query(
      `
        UPDATE partners
        SET
          company_name = $1,
          inn = $2,
          partner_type = $3,
          rating = $4,
          address = $5,
          director = $6,
          phone = $7,
          contact_email = $8
        WHERE partner_id = $9
        RETURNING *
      `,
      [
        companyName,
        inn,
        partnerType,
        rating,
        address,
        director,
        phone,
        email,
        partnerId
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Не удалось обновить партнера'
    });
  }
});


app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
