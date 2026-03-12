import { Router } from 'express';
import prisma from '../config/prisma.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Dashboard - metricas gerais
router.get('/', authenticate, async (req, res) => {
  try {
    let metrics;

    if (req.user.role === 'admin') {
      // Admin ve total de todos afiliados
      const result = await prisma.affiliateMetric.aggregate({
        _sum: {
          registros: true,
          ftd: true,
          qftd: true,
          depositos: true,
          rev: true,
          cpa: true
        }
      });

      metrics = {
        total_registros: result._sum.registros || 0,
        total_ftd: result._sum.ftd || 0,
        total_qftd: result._sum.qftd || 0,
        total_depositos: Number(result._sum.depositos || 0),
        total_rev: Number(result._sum.rev || 0),
        total_cpa: Number(result._sum.cpa || 0)
      };
    } else {
      // Afiliado ve apenas suas metricas
      const userMetrics = await prisma.affiliateMetric.findUnique({
        where: { userId: req.user.id }
      });

      metrics = {
        total_registros: userMetrics?.registros || 0,
        total_ftd: userMetrics?.ftd || 0,
        total_qftd: userMetrics?.qftd || 0,
        total_depositos: Number(userMetrics?.depositos || 0),
        total_rev: Number(userMetrics?.rev || 0),
        total_cpa: Number(userMetrics?.cpa || 0)
      };
    }

    // Calcular REV + CPA
    metrics.total_rev_cpa = metrics.total_rev + metrics.total_cpa;

    res.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Dashboard por casa de apostas
router.get('/by-house', authenticate, async (req, res) => {
  try {
    const houses = await prisma.bettingHouse.findMany({
      where: { status: 'active' },
      include: {
        cpaRecords: {
          where: req.user.role !== 'admin' ? { userId: req.user.id } : {}
        }
      },
      orderBy: { name: 'asc' }
    });

    const result = houses.map(house => {
      const totalCpas = house.cpaRecords.length;
      const totalCpaValue = house.cpaRecords.reduce((sum, r) => sum + Number(r.cpaValue), 0);
      const totalDeposits = house.cpaRecords.reduce((sum, r) => sum + Number(r.depositValue), 0);

      return {
        id: house.id,
        name: house.name,
        cpa_percentage: house.cpaPercentage,
        total_cpas: totalCpas,
        total_cpa_value: totalCpaValue,
        total_deposits: totalDeposits
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar dashboard por casa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatisticas gerais (apenas admin)
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    // Total de afiliados
    const totalAffiliates = await prisma.user.count({
      where: { role: 'affiliate' }
    });

    // Saques pendentes
    const pendingWithdrawals = await prisma.withdrawal.aggregate({
      where: { status: 'pending' },
      _count: true,
      _sum: { amount: true }
    });

    // CPAs pendentes
    const pendingCpas = await prisma.cpaRecord.count({
      where: { status: 'pending' }
    });

    // Casas ativas
    const activeHouses = await prisma.bettingHouse.count({
      where: { status: 'active' }
    });

    res.json({
      total_affiliates: totalAffiliates,
      pending_withdrawals: {
        count: pendingWithdrawals._count,
        amount: Number(pendingWithdrawals._sum.amount || 0)
      },
      pending_cpas: pendingCpas,
      active_houses: activeHouses
    });
  } catch (error) {
    console.error('Erro ao buscar estatisticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
