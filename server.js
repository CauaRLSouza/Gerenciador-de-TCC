const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const usuariosMock = [
    { email: 'aluno@teste.com', perfil: 'Aluno' },
    { email: 'prof@teste.com', perfil: 'Professor' },
    { email: 'sec@teste.com', perfil: 'Secretariado' }
];

function proibirAcessoDireto(req, res, next) {
    const referer = req.headers.referer;

    if (!referer) {
        return res.redirect('/login');
    }

    next();
}

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('Login/Login', { erro: null });
});

app.post('/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.render('Login/Login', { erro: 'Por favor, informe seu e-mail.' });
    }

    const usuarioEncontrado = usuariosMock.find(u => u.email.toLowerCase() === email.toLowerCase());

    let perfil = null;

    if (usuarioEncontrado) {
        perfil = usuarioEncontrado.perfil;
    } else if (email.includes('prof')) {
        perfil = 'Professor';
    } else if (email.includes('sec')) {
        perfil = 'Secretariado';
    } else if (email.includes('aluno')) {
        perfil = 'Aluno';
    }

    if (!perfil) {
        return res.render('Login/Login', { erro: 'E-mail ou senha inválidos.' });
    }

    res.redirect(`/dashboard?perfil=${perfil}`);
});

app.get('/dashboard', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Dashboard`, { currentPage: 'inicio', perfil });
});

app.get(['/meutcc', '/meu-tcc'], proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/MeuTCC`, { currentPage: 'meutcc', perfil });
});

app.get('/notificacoes', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Notificacoes`, { currentPage: 'notificacoes', perfil });
});

app.get('/configuracoes', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Configuracoes`, { currentPage: 'configuracoes', perfil });
});

app.get('/versoes', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Versoes`, { currentPage: 'versoes', perfil });
});

app.get('/agenda', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Agenda`, { currentPage: 'agenda', perfil });
});

app.get('/acervo', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Acervo`, { currentPage: 'acervo', perfil });
});

app.get('/perfil', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/Perfil`, { currentPage: 'perfil', perfil });
});

app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});