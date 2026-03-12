-- Criar os ENUMs necessários
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('admin', 'affiliate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "CpaStatus" AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "WithdrawalStatus" AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PixType" AS ENUM ('cpf', 'cnpj', 'email', 'phone', 'random');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    instagram VARCHAR(255),
    role "Role" DEFAULT 'affiliate',
    status "Status" DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela betting_houses
CREATE TABLE IF NOT EXISTS betting_houses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cpa_percentage DECIMAL(5, 2) DEFAULT 0,
    affiliate_link VARCHAR(500),
    logo_url VARCHAR(500),
    status "Status" DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela affiliate_metrics
CREATE TABLE IF NOT EXISTS affiliate_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    registros INTEGER DEFAULT 0,
    ftd INTEGER DEFAULT 0,
    qftd INTEGER DEFAULT 0,
    depositos DECIMAL(12, 2) DEFAULT 0,
    rev DECIMAL(12, 2) DEFAULT 0,
    cpa DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela affiliate_houses
CREATE TABLE IF NOT EXISTS affiliate_houses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    house_id INTEGER REFERENCES betting_houses(id) ON DELETE CASCADE,
    cpa_agreement DECIMAL(12, 2) DEFAULT 0,
    custom_link VARCHAR(500),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, house_id)
);

-- Criar tabela cpa_records
CREATE TABLE IF NOT EXISTS cpa_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    house_id INTEGER REFERENCES betting_houses(id) ON DELETE CASCADE,
    player_name VARCHAR(255),
    cpa_value DECIMAL(12, 2) NOT NULL,
    deposit_value DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    status "CpaStatus" DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    pix_key VARCHAR(255),
    pix_type "PixType",
    status "WithdrawalStatus" DEFAULT 'pending',
    notes TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_houses_user_id ON affiliate_houses(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_houses_house_id ON affiliate_houses(house_id);
CREATE INDEX IF NOT EXISTS idx_cpa_records_user_id ON cpa_records(user_id);
CREATE INDEX IF NOT EXISTS idx_cpa_records_house_id ON cpa_records(house_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
