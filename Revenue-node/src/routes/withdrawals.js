import { Router } from 'express';
import prisma from '../config/prisma.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Listar saques (admin ve todos, afiliado ve os seus)
router.get('/', authenticate, async (req, res) => {
  try {
    const whereClause = req.user.role !== 'admin' 
      ? { userId: req.user.id } 
      : {};

    const withdrawals = await prisma.withdrawal.findMany({
      where: whereClause,
      include: {
        user: {
          select: { email: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(withdrawals.map(w => ({
      id: w.id,
      user_id: w.userId,
      user_email: w.user.email,
      user_name: w.user.name,
      amount: w.amount,
      pix_key: w.pixKey,
      pix_type: w.pixType,
      status: w.status,
      notes: w.notes,
      processed_at: w.processedAt,
      created_at: w.createdAt
    })));
  } catch (error) {
    console.error('Erro ao listar saques:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar solicitacao de saque
router.post('/', authenticate, async (req, res) => {
  try {
    const { amount, pix_key, pix_type } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor invalido' });
    }

    if (!pix_key || !pix_type) {
      return res.status(400).json({ error: 'Chave PIX e obrigatoria' });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: req.user.id,
        amount,
        pixKey: pix_key,
        pixType: pix_type,
        status: 'pending'
      }
    });

    res.status(201).json({
      id: withdrawal.id,
      user_id: withdrawal.userId,
      amount: withdrawal.amount,
      pix_key: withdrawal.pixKey,
      pix_type: withdrawal.pixType,
      status: withdrawal.status,
      created_at: withdrawal.createdAt
    });
  } catch (error) {
    console.error('Erro ao criar saque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do saque (apenas admin)
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
      return res.status(400).json({ error: 'Status invalido' });
    }

    const withdrawal = await prisma.withdrawal.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
        processedAt: status === 'paid' ? new Date() : undefined
      },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    });

    res.json({
      id: withdrawal.id,
      user_id: withdrawal.userId,
      user_email: withdrawal.user.email,
      user_name: withdrawal.user.name,
      amount: withdrawal.amount,
      pix_key: withdrawal.pixKey,
      pix_type: withdrawal.pixType,
      status: withdrawal.status,
      notes: withdrawal.notes,
      processed_at: withdrawal.processedAt,
      created_at: withdrawal.createdAt
    });
  } catch (error) {
    console.error('Erro ao atualizar saque:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Saque nao encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
