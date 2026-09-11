DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS partners;


CREATE TABLE partners (
    partner_id INTEGER NOT NULL,

    company_name VARCHAR(255) NOT NULL,
    inn VARCHAR(12) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    rating DECIMAL(2, 1),

    CONSTRAINT pk_partners
        PRIMARY KEY (partner_id),

    CONSTRAINT uq_partners_inn
        UNIQUE (inn),

    CONSTRAINT uq_partners_contact_email
        UNIQUE (contact_email),

    CONSTRAINT chk_partners_inn_length
        CHECK (char_length(inn) IN (10, 12)),

    CONSTRAINT chk_partners_rating
        CHECK (rating BETWEEN 0 AND 5)
);


CREATE TABLE products (
    product_id INTEGER GENERATED ALWAYS AS IDENTITY,

    article VARCHAR(64),
    product_name VARCHAR(255) NOT NULL,
    unit VARCHAR(32),
    price DECIMAL(12, 2),

    CONSTRAINT pk_products
        PRIMARY KEY (product_id),

    CONSTRAINT uq_products_article
        UNIQUE (article),

    CONSTRAINT uq_products_product_name
        UNIQUE (product_name),

    CONSTRAINT chk_products_price
        CHECK (price >= 0)
);


CREATE TABLE sales (
    sale_id INTEGER NOT NULL,

    partner_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,

    sale_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,

    CONSTRAINT pk_sales
        PRIMARY KEY (sale_id),

    CONSTRAINT fk_sales_partner
        FOREIGN KEY (partner_id)
        REFERENCES partners(partner_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_sales_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_sales_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_sales_total_amount
        CHECK (total_amount >= 0)
);
