const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware para permitir CORS (opcional, mas útil para desenvolvimento)
app.use(cors());

// Variáveis de ambiente (configure no Render)
const API_BASE_URL = process.env.API_BASE_URL || 'http://jnfinfo-001-site3.ntempurl.com';
const API_USERNAME = process.env.API_USERNAME || 'admin';
const API_PASSWORD = process.env.API_PASSWORD || '123456';

let accessToken = null;

// Rota de login (proxy para autenticação)
app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: API_USERNAME,
      password: API_PASSWORD
    });
    accessToken = response.data.token;
    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Falha na autenticação' });
  }
});

// Rota de clientes (proxy para consulta)
app.get('/api/clientes', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'Token não disponível' });
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clientes`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar clientes' });
  }
});

