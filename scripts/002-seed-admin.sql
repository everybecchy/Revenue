-- Seed do usuário admin
-- Senha: Mudar123 
-- IMPORTANTE: Este hash foi gerado com bcrypt. 
-- Se precisar gerar um novo hash, use: node -e "require('bcrypt').hash('Mudar123', 10).then(h => console.log(h))"

INSERT INTO users (email, password_hash, name, role, status)
VALUES (
    'admin@bravopanel.com',
    '$2b$10$YD8c8YhN.4dZ0GEJKNhU4.rJKQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ',
    'Administrador',
    'admin',
    'active'
) ON CONFLICT (email) DO UPDATE SET
    password_hash = '$2b$10$YD8c8YhN.4dZ0GEJKNhU4.rJKQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ',
    name = 'Administrador',
    role = 'admin',
    status = 'active';

-- Casas de apostas exemplo
INSERT INTO betting_houses (name, cpa_percentage, affiliate_link, status) VALUES
('BetMGM', 50.00, 'https://betmgm.com/ref/', 'active'),
('Novibet', 45.00, 'https://novibet.com/ref/', 'active'),
('SuperBet', 40.00, 'https://superbet.com/ref/', 'active'),
('LotusBet', 55.00, 'https://lotusbet.com/ref/', 'active')
ON CONFLICT DO NOTHING;
