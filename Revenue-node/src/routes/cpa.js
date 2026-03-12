import { Router } from 'express';
import prisma from '../config/prisma.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Listar CPAs (admin ve todos, afiliado ve os seus)
router.get('/', authenticate, async (req, res) => {
  try {
    const whereClause = req.user.role !== 'admin' 
      ? { userId: req.user.id } 
      : {};

    const records = await prisma.cpaRecord.findMany({
      where: whereClause,
      include: {
        house: true,
        user: {
          select: { email: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(records.map(r => ({
      id: r.id,
      user_id: r.userId,
      house_id: r.houseId,
      house_name: r.house.name,
      user_email: r.user.email,
      user_name: r.user.name,
      player_name: r.playerName,
      cpa_value: r.cpaValue,
      deposit_value: r.depositValue,
      notes: r.notes,
      status: r.status,
      created_at: r.createdAt
    })));
  } catch (error) {
    console.error('Erro ao listar CPAs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar registro de CPA
router.post('/', authenticate, async (req, res) => {
  try {
    const { house_id, player_name, cpa_value, deposit_value, notes } = req.body;

    if (!house_id || !cpa_value) {
      return res.status(400).json({ error: 'Casa e valor do CPA sao obrigatorios' });
    }

    // Verificar se a casa existe
    const house = await prisma.bettingHouse.findUnique({ where: { id: house_id } });
    if (!house) {
      return res.status(400).json({ error: 'Casa nao encontrada' });
    }

    const record = await prisma.cpaRecord.create({
      data: {
        userId: req.user.id,
        houseId: house_id,
        playerName: player_name || null,
        cpaValue: cpa_value,
        depositValue: deposit_value || 0,
        notes: notes || null,
        status: 'pending'
      },
      include: {
        house: true
      }
    });

    res.status(201).json({
      id: record.id,
      user_id: record.userId,
      house_id: record.houseId,
      house_name: record.house.name,
      player_name: record.playerName,
      cpa_value: record.cpaValue,
      deposit_value: record.depositValue,
      notes: record.notes,
      status: record.status,
      created_at: record.createdAt
    });
  } catch (error) {
    console.error('Erro ao criar CPA:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do CPA (apenas admin)
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
      return res.status(400).json({ error: 'Status invalido' });
    }

    const record = await prisma.cpaRecord.update({
      where: { id },
      data: { status },
      include: { house: true }
    });

    res.json({
      id: record.id,
      user_id: record.userId,
      house_id: record.houseId,
      house_name: record.house.name,
      player_name: record.playerName,
      cpa_value: record.cpaValue,
      deposit_value: record.depositValue,
      notes: record.notes,
      status: record.status,
      created_at: record.createdAt
    });
  } catch (error) {
    console.error('Erro ao atualizar status do CPA:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro de CPA nao encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar registro de CPA (apenas admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.cpaRecord.delete({ where: { id } });

    res.json({ message: 'Registro deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar CPA:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Registro nao encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
