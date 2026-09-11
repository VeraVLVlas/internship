-- ============================================================
-- Импорт подготовленных данных
-- ============================================================

-- Импорт партнеров
\copy partners (partner_id, company_name, inn, contact_email, phone, rating)
FROM './prepared_partners.csv'
WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- После явного импорта partner_id синхронизируем sequence
SELECT setval(
    pg_get_serial_sequence('partners', 'partner_id'),
    COALESCE((SELECT MAX(partner_id) FROM partners), 1),
    EXISTS (SELECT 1 FROM partners)
);


-- Импорт товаров
\copy products (product_id, product_name)
FROM './prepared_products.csv'
WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- После явного импорта product_id синхронизируем sequence
SELECT setval(
    pg_get_serial_sequence('products', 'product_id'),
    COALESCE((SELECT MAX(product_id) FROM products), 1),
    EXISTS (SELECT 1 FROM products)
);


-- Импорт продаж
\copy sales (sale_id, partner_id, product_id, sale_date, quantity, total_amount)
FROM './prepared_sales.csv'
WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

-- После явного импорта sale_id синхронизируем sequence
SELECT setval(
    pg_get_serial_sequence('sales', 'sale_id'),
    COALESCE((SELECT MAX(sale_id) FROM sales), 1),
    EXISTS (SELECT 1 FROM sales)
);


-- ============================================================
-- Проверка количества импортированных строк
-- ============================================================

SELECT COUNT(*) AS partners_count
FROM partners;

SELECT COUNT(*) AS products_count
FROM products;

SELECT COUNT(*) AS sales_count
FROM sales;
