CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Таблица пользователей (для auth-service)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt хеш (60+ символов)
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Таблица услуг (для user-service)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_from NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов (для user-service)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- может быть NULL для гостей
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    description TEXT,
    area NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'pending',  -- pending, in_progress, completed, cancelled
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);


INSERT INTO services (title, description, price_from, image_url) VALUES
('Дизайн интерьера', 'Полный дизайн-проект квартиры или дома', 1500.00, '/images/design.jpg'),
('Ремонт под ключ', 'Комплексный ремонт с материалами', 5000.00, '/images/repair.jpg'),
('Декорирование', 'Подбор мебели и аксессуаров', 800.00, '/images/decor.jpg')
ON CONFLICT DO NOTHING;