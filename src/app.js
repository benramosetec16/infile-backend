const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Configurações e Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// ROTA DE STATUS / SAÚDE DA API
// ==========================================
app.get('/api/status', (req, res) => {
  res.json({ status: 'A API InFile está online e funcionando perfeitamente!', timestamp: new Date() });
});

// ==========================================
// LUGARES (Hospitais, Clínicas, etc.)
// ==========================================

// Criar um novo Lugar
app.post('/api/places', async (req, res) => {
  try {
    const { name, category } = req.body;
    const place = await prisma.place.create({
      data: { name, category }
    });
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar lugar', details: error.message });
  }
});

// Listar todos os Lugares e suas filas atuais
app.get('/api/places', async (req, res) => {
  try {
    const places = await prisma.place.findMany({
      include: {
        queues: true
      }
    });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar lugares', details: error.message });
  }
});

// ==========================================
// FILAS (Triagem, Consultório, etc.)
// ==========================================

// Criar uma nova Fila dentro de um Lugar
app.post('/api/queues', async (req, res) => {
  try {
    const { placeId, name, description } = req.body;
    const queue = await prisma.queue.create({
      data: { placeId, name, description }
    });
    res.status(201).json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fila', details: error.message });
  }
});

// Obter detalhes de uma fila específica e todos os seus tickets (senhas)
app.get('/api/queues/:id', async (req, res) => {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: req.params.id },
      include: {
        tickets: {
          orderBy: { queueNumber: 'asc' }
        }
      }
    });
    
    if (!queue) return res.status(404).json({ error: 'Fila não encontrada' });
    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a fila', details: error.message });
  }
});

// ==========================================
// TICKETS (Senhas / Entradas na fila)
// ==========================================

// Entrar na Fila (Criar um novo Ticket/Senha)
app.post('/api/tickets', async (req, res) => {
  try {
    const { queueId, customerName, customerPhone } = req.body;
    
    // Obter o último número da fila para saber qual é o próximo.
    const lastTicket = await prisma.ticket.findFirst({
      where: { queueId },
      orderBy: { queueNumber: 'desc' }
    });
    
    const nextNumber = lastTicket ? lastTicket.queueNumber + 1 : 1;

    const ticket = await prisma.ticket.create({
      data: {
        queueId,
        customerName,
        customerPhone,
        queueNumber: nextNumber,
        status: 'WAITING' // WAITING = Aguardando atendimento
      }
    });
    
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao entrar na fila', details: error.message });
  }
});

// Atualizar o status de um Ticket (ex: Chamar, Concluir, Cancelar)
app.patch('/api/tickets/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // 'CALLED' (Chamado), 'COMPLETED' (Atendido), 'CANCELLED' (Desistiu/Cancelou)
    
    // Valiadação de enum
    if (!['WAITING', 'CALLED', 'COMPLETED', 'CANCELLED'].includes(status)) {
       return res.status(400).json({ error: 'Status inválido. Use WAITING, CALLED, COMPLETED ou CANCELLED.' });
    }

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status do ticket', details: error.message });
  }
});

module.exports = app;
