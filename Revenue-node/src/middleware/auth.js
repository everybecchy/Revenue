import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token nao fornecido' });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalido' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      throw err;
    }
    
    // Verificar se a sessao ainda e valida
    const session = await prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!session) {
      return res.status(401).json({ error: 'Sessao expirada ou invalida' });
    }

    // Buscar dados do usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario nao encontrado' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Usuario bloqueado ou inativo' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Erro na autenticacao:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores.' });
  }
  next();
};
