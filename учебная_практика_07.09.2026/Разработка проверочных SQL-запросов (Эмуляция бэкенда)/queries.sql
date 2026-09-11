-- ============================================================
-- 1. Список партнеров
-- ============================================================
-- Выводит всех партнеров, включая тех, у которых еще нет продаж.
-- Для каждого партнера показывает количество совершенных поставок.
-- Результат сортируется по названию компании.

SELECT
    p.partner_id,
    p.company_name,
    p.inn,
    p.contact_email,
    p.phone,
    p.rating,
    COUNT(s.sale_id) AS deliveries_count
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
    p.company_name ASC;


-- ============================================================
-- 2. Создание нового партнера и его первой тестовой поставки
-- ============================================================
-- Обе операции выполняются в одной транзакции.
-- Идентификаторы генерируются СУБД автоматически.
-- ID созданного партнера передается в запись о поставке
-- через RETURNING.

BEGIN;

WITH new_partner AS (
    INSERT INTO partners (
        company_name,
        inn,
        contact_email,
        phone,
        rating
    )
    VALUES (
        'ООО "Тестовый партнер"',
        '7700000000',
        'test.partner@example.com',
        '+7 (999) 000-00-00',
        5.0
    )
    RETURNING partner_id
)
INSERT INTO sales (
    partner_id,
    product_id,
    sale_date,
    quantity,
    total_amount
)
SELECT
    partner_id,
    1,
    CURRENT_DATE,
    10,
    5000.00
FROM new_partner;

COMMIT;


-- ============================================================
-- 3. История реализации конкретного партнера за период
-- ============================================================
-- $1 = partner_id
-- $2 = дата начала периода
-- $3 = дата окончания периода


SELECT
    s.sale_id,
    p.company_name,
    pr.product_name,
    s.sale_date,
    s.quantity,
    s.total_amount
FROM sales s
JOIN partners p
    ON p.partner_id = s.partner_id
JOIN products pr
    ON pr.product_id = s.product_id
WHERE
    s.partner_id = $1
    AND s.sale_date BETWEEN $2 AND $3
ORDER BY
    s.sale_date ASC,
    s.sale_id ASC;
