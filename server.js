const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Variáveis de ambiente (configure no Render)
const API_BASE_URL = process.env.API_BASE_URL || 'http://jnfinfo-001-site3.ntempurl.com';
const API_USERNAME = process.env.API_USERNAME || 'admin';
const API_PASSWORD = process.env.API_PASSWORD || '123456';

let accessToken = null;

// Endpoint de saúde (obrigatório para Render)
app.get('/', (req, res) => {
  res.send('Proxy API está online');
});

// Autenticação
app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: API_USERNAME,
      password: API_PASSWORD
    });
    accessToken = response.data.token;
    res.json({ token: accessToken });
  } catch (error) {
    console.error('Erro de autenticação:', error.message);
    res.status(500).json({ error: 'Falha na autenticação' });
  }
});

// Consulta de clientes
app.get('/api/clientes', async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: 'Token de acesso não disponível' });
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/clientes`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erro na API de clientes:', error.message);
    res.status(500).json({ error: 'Falha ao buscar clientes' });
  }
});

// Configuração específica para Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Conectado à API: ${API_BASE_URL}`);
});