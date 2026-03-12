// Script para criar o admin inicial com a senha correta
// Execute com: node scripts/seed-admin.js

import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './Revenue-node/.env' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedAdmin() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Hash da senha
    const passwordHash = await bcrypt.hash('Mudar123', 10);
    console.log('Hash gerado para senha "Mudar123":', passwordHash);
    
    // Inserir ou atualizar admin
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, name, role, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = $2,
        name = $3,
        role = $4,
        status = $5
      RETURNING id, email, name, role
    `, ['admin@bravopanel.com', passwordHash, 'Administrador', 'admin', 'active']);
    
    console.log('Admin criado/atualizado:', result.rows[0]);
    
    // Inserir casas de apostas
    const houses = [
      { name: 'BetMGM', cpa: 50, link: 'https://betmgm.com/ref/' },
      { name: 'Novibet', cpa: 45, link: 'https://novibet.com/ref/' },
      { name: 'SuperBet', cpa: 40, link: 'https://superbet.com/ref/' },
      { name: 'LotusBet', cpa: 55, link: 'https://lotusbet.com/ref/' },
    ];
    
    for (const house of houses) {
      await pool.query(`
        INSERT INTO betting_houses (name, cpa_percentage, affiliate_link, status)
        VALUES ($1, $2, $3, 'active')
        ON CONFLICT DO NOTHING
      `, [house.name, house.cpa, house.link]);
    }
    
    console.log('Casas de apostas criadas!');
    console.log('\n--- Credenciais do Admin ---');
    console.log('Email: admin@bravopanel.com');
    console.log('Senha: Mudar123');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
  }
}

seedAdmin();
