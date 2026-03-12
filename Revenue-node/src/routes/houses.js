import { Router } from 'express';
import prisma from '../config/prisma.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Listar todas as casas de apostas
router.get('/', authenticate, async (req, res) => {
  try {
    const houses = await prisma.bettingHouse.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json(houses.map(h => ({
      id: h.id,
      name: h.name,
      cpa_percentage: h.cpaPercentage,
      affiliate_link: h.affiliateLink,
      logo_url: h.logoUrl,
      status: h.status,
      created_at: h.createdAt
    })));
  } catch (error) {
    console.error('Erro ao listar casas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar casa por ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const house = await prisma.bettingHouse.findUnique({ where: { id } });
    
    if (!house) {
      return res.status(404).json({ error: 'Casa nao encontrada' });
    }

    res.json({
      id: house.id,
      name: house.name,
      cpa_percentage: house.cpaPercentage,
      affiliate_link: house.affiliateLink,
      logo_url: house.logoUrl,
      status: house.status,
      created_at: house.createdAt
    });
  } catch (error) {
    console.error('Erro ao buscar casa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar casa (apenas admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, cpa_percentage, affiliate_link, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome e obrigatorio' });
    }

    const house = await prisma.bettingHouse.create({
      data: {
        name,
        cpaPercentage: cpa_percentage || 0,
        affiliateLink: affiliate_link || null,
        logoUrl: logo_url || null,
        status: 'active'
      }
    });

    res.status(201).json({
      id: house.id,
      name: house.name,
      cpa_percentage: house.cpaPercentage,
      affiliate_link: house.affiliateLink,
      logo_url: house.logoUrl,
      status: house.status,
      created_at: house.createdAt
    });
  } catch (error) {
    console.error('Erro ao criar casa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar casa (apenas admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cpa_percentage, affiliate_link, logo_url, status } = req.body;

    const existing = await prisma.bettingHouse.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Casa nao encontrada' });
    }

    const house = await prisma.bettingHouse.update({
      where: { id },
      data: {
        name: name ?? undefined,
        cpaPercentage: cpa_percentage ?? undefined,
        affiliateLink: affiliate_link ?? undefined,
        logoUrl: logo_url ?? undefined,
        status: status ?? undefined
      }
    });

    res.json({
      id: house.id,
      name: house.name,
      cpa_percentage: house.cpaPercentage,
      affiliate_link: house.affiliateLink,
      logo_url: house.logoUrl,
      status: house.status,
      created_at: house.createdAt
    });
  } catch (error) {
    console.error('Erro ao atualizar casa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar casa (apenas admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.bettingHouse.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Casa nao encontrada' });
    }

    await prisma.bettingHouse.delete({ where: { id } });

    res.json({ message: 'Casa deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar casa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
