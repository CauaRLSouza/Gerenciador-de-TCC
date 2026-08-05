const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function proibirAcessoDireto(req, res, next) {
    const referer = req.headers.referer;

    if (!referer) {
        return res.redirect('/login');
    }

    // Se o acesso veio de um clique interno no sistema, permite o carregamento
    next();
}



app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('Login/Login');
});


app.get('/dashboard', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Dashboard', { currentPage: 'inicio' });
});

app.get(['/meutcc', '/meu-tcc'], proibirAcessoDireto, (req, res) => {
    res.render('Aluno/MeuTCC', { currentPage: 'meutcc' });
});

app.get('/notificacoes', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Notificacoes', { currentPage: 'notificacoes' });
});

app.get('/configuracoes', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Configuracoes', { currentPage: 'configuracoes' });
});

app.get('/versoes', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Versoes', { currentPage: 'versoes' });
});

app.get('/agenda', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Agenda', { currentPage: 'agenda' });
});

app.get('/acervo', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Acervo', { currentPage: 'acervo' });
});

app.get('/perfil', proibirAcessoDireto, (req, res) => {
    res.render('Aluno/Perfil', { currentPage: 'perfil' });
});


app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});