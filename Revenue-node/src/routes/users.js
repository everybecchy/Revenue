import { Router } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// Listar todos os usuarios (apenas admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'affiliate' },
      include: {
        affiliateMetric: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      instagram: u.instagram,
      role: u.role,
      status: u.status,
      created_at: u.createdAt,
      registros: u.affiliateMetric?.registros || 0,
      ftd: u.affiliateMetric?.ftd || 0,
      qftd: u.affiliateMetric?.qftd || 0,
      depositos: u.affiliateMetric?.depositos || 0,
      rev: u.affiliateMetric?.rev || 0,
      cpa: u.affiliateMetric?.cpa || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('Erro ao listar usuarios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuario por ID (apenas admin)
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        affiliateMetric: true,
        affiliateHouses: {
          include: {
            house: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      instagram: user.instagram,
      role: user.role,
      status: user.status,
      created_at: user.createdAt,
      registros: user.affiliateMetric?.registros || 0,
      ftd: user.affiliateMetric?.ftd || 0,
      qftd: user.affiliateMetric?.qftd || 0,
      depositos: user.affiliateMetric?.depositos || 0,
      rev: user.affiliateMetric?.rev || 0,
      cpa: user.affiliateMetric?.cpa || 0,
      houses: user.affiliateHouses.map(ah => ({
        id: ah.id,
        house_id: ah.houseId,
        house_name: ah.house.name,
        cpa_agreement: ah.cpaAgreement,
        custom_link: ah.customLink,
        is_active: ah.isActive
      }))
    });
  } catch (error) {
    console.error('Erro ao buscar usuario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar usuario (apenas admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { email, password, name, instagram } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha sao obrigatorios' });
    }

    // Verificar se email ja existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email ja cadastrado' });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuario com metricas iniciais
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        instagram: instagram || null,
        role: 'affiliate',
        status: 'active',
        affiliateMetric: {
          create: {
            registros: 0,
            ftd: 0,
            qftd: 0,
            depositos: 0,
            rev: 0,
            cpa: 0
          }
        }
      }
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      instagram: newUser.instagram,
      role: newUser.role,
      status: newUser.status,
      created_at: newUser.createdAt
    });
  } catch (error) {
    console.error('Erro ao criar usuario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar usuario (apenas admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { email, password, name, instagram, status } = req.body;

    // Verificar se usuario existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    // Se email foi alterado, verificar se ja existe
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
      if (emailExists) {
        return res.status(400).json({ error: 'Email ja cadastrado' });
      }
    }

    // Construir dados de atualizacao
    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);
    if (name !== undefined) updateData.name = name;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (status) updateData.status = status;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      instagram: updatedUser.instagram,
      role: updatedUser.role,
      status: updatedUser.status,
      created_at: updatedUser.createdAt
    });
  } catch (error) {
    console.error('Erro ao atualizar usuario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar usuario (apenas admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Nao e possivel deletar um admin' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Usuario deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuario:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar metricas do afiliado (apenas admin)
router.put('/:id/metrics', authenticate, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { registros, ftd, qftd, depositos, rev, cpa } = req.body;

    const metrics = await prisma.affiliateMetric.upsert({
      where: { userId: id },
      update: {
        registros: registros ?? undefined,
        ftd: ftd ?? undefined,
        qftd: qftd ?? undefined,
        depositos: depositos ?? undefined,
        rev: rev ?? undefined,
        cpa: cpa ?? undefined
      },
      create: {
        userId: id,
        registros: registros || 0,
        ftd: ftd || 0,
        qftd: qftd || 0,
        depositos: depositos || 0,
        rev: rev || 0,
        cpa: cpa || 0
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error('Erro ao atualizar metricas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar casas do afiliado (apenas admin)
router.put('/:id/houses', authenticate, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { houses } = req.body; // Array de { house_id, cpa_agreement, custom_link, is_active }

    // Deletar associacoes existentes
    await prisma.affiliateHouse.deleteMany({
      where: { userId: id }
    });

    // Inserir novas associacoes
    if (houses && houses.length > 0) {
      await prisma.affiliateHouse.createMany({
        data: houses.map(h => ({
          userId: id,
          houseId: h.house_id,
          cpaAgreement: h.cpa_agreement || 0,
          customLink: h.custom_link || null,
          isActive: h.is_active || false
        }))
      });
    }

    res.json({ message: 'Casas atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar casas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
