const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração da View Engine para arquivos EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos da pasta 'public' (CSS, imagens, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para tratar requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- ROTAS DO SISTEMA ---

// Redireciona a raiz para o login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Tela de Login (views/Login/Login.ejs)
app.get('/login', (req, res) => {
    res.render('Login/Login');
});

app.get('/dashboard', (req, res) => {
    res.render('Aluno/Dashboard', { currentPage: 'inicio' });
});

app.get('/meutcc', (req, res) => {
    res.render('Aluno/MeuTCC', { currentPage: 'meutcc' });
});

app.get('/agenda', (req, res) => {
    res.render('Aluno/Agenda', { currentPage: 'agenda' });
});

app.get('/acervo', (req, res) => {
    res.render('Aluno/Acervo', { currentPage: 'acervo' });
});

app.get('/perfil', (req, res) => {
    res.render('Aluno/Perfil', { currentPage: 'perfil' });
});

// Rota para tratar erro 404
app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

// Inicialização
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});