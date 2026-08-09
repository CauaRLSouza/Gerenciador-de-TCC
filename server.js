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

const orientandosAtivosMock = [
    {
        id: '1',
        nome: 'João da Silva',
        iniciais: 'JS',
        email: 'joao.silva@aluno.edu.br',
        curso: 'Sistemas de Informação',
        tituloTCC: 'Desenvolvimento de um sistema de gerenciamento acadêmico utilizando tecnologias web',
        dataInicio: '10/03/2025',
        previsaoConclusao: '15/12/2025',
        linhaPesquisa: 'Engenharia de Software',
        status: 'Aguardando revisão',
        statusCor: 'yellow',
        versaoAtual: 'Versão 3 enviada em 15/08/2025',
        versoes: [
            { id: 3, titulo: 'Versão 3 (Final)', data: '15/08/2025', status: 'Aguardando revisão' },
            { id: 2, titulo: 'Versão 2 (Parcial)', data: '01/08/2025', status: 'Revisada' },
            { id: 1, titulo: 'Versão 1 (Pré-projeto)', data: '10/03/2025', status: 'Aprovado' }
        ],
        reunioes: [
            { id: 101, data: '18/08/2025', hora: '14:00', pauta: 'Revisão do Capítulo 3' },
            { id: 102, data: '02/08/2025', hora: '10:00', pauta: 'Alinhamento dos Requisitos' }
        ],
        comentarios: [
            { id: 201, autor: 'Você', data: '02/08/2025', texto: 'Ajustar a metodologia no capítulo 2.' },
            { id: 202, autor: 'João da Silva', data: '03/08/2025', texto: 'Ajustes realizados conforme solicitado.' }
        ]
    },
    {
        id: '2',
        nome: 'Maria Santos',
        iniciais: 'MS',
        email: 'maria.santos@aluno.edu.br',
        curso: 'Ciência da Computação',
        tituloTCC: 'Arquiteturas de Microserviços e Resiliência em Sistemas Distribuídos',
        dataInicio: '15/02/2025',
        previsaoConclusao: '10/12/2025',
        linhaPesquisa: 'Sistemas Distribuídos',
        status: 'Revisada',
        statusCor: 'green',
        versaoAtual: 'Versão 1 enviada em 12/08/2025',
        versoes: [
            { id: 1, titulo: 'Versão 1 (Capítulos 1 e 2)', data: '12/08/2025', status: 'Revisada' }
        ],
        reunioes: [
            { id: 105, data: '14/08/2025', hora: '09:00', pauta: 'Discussão sobre carga de testes' }
        ],
        comentarios: [
            { id: 205, autor: 'Você', data: '13/08/2025', texto: 'Capítulo 1 muito bem estruturado.' }
        ]
    },
    {
        id: '3',
        nome: 'Carlos Correia',
        iniciais: 'CC',
        email: 'carlos.correia@aluno.edu.br',
        curso: 'Engenharia de Software',
        tituloTCC: 'Análise de Desempenho e Algoritmos de Machine Learning na Detecção de Anomalias',
        dataInicio: '01/04/2025',
        previsaoConclusao: '20/12/2025',
        linhaPesquisa: 'Inteligência Artificial',
        status: 'Revisada',
        statusCor: 'green',
        versaoAtual: 'Versão 2 enviada em 10/08/2025',
        versoes: [
            { id: 2, titulo: 'Versão 2 (Capítulos 1 ao 4)', data: '10/08/2025', status: 'Revisada' },
            { id: 1, titulo: 'Versão 1 (Introdução e Metodologia)', data: '15/05/2025', status: 'Aprovado' }
        ],
        reunioes: [
            { id: 103, data: '12/08/2025', hora: '16:00', pauta: 'Validação dos Experimentos Práticos' }
        ],
        comentarios: [
            { id: 203, autor: 'Você', data: '11/08/2025', texto: 'Os resultados do gráfico 4 precisam de detalhamento nas conclusões.' }
        ]
    }
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

app.get('/orientandos', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Professor';
    res.render(`${perfil}/Orientandos`, { 
        currentPage: 'orientandos', 
        perfil,
        orientandos: orientandosAtivosMock
    });
});

app.get('/orientando/:id', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Professor';
    const alunoId = req.params.id;

    const orientandoEncontrado = orientandosAtivosMock.find(a => String(a.id) === String(alunoId));

    if (!orientandoEncontrado) {
        return res.status(404).send('<h1>Orientando não encontrado</h1>');
    }

    res.render(`${perfil}/OrientandoDetalhes`, { 
        currentPage: 'orientandos', 
        perfil, 
        orientando: orientandoEncontrado,
        orientandoId: orientandoEncontrado.id
    });
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

app.get('/naolidos', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/NaoLidos`, { currentPage: 'NaoLidos', perfil });
});

app.get('/bancas', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/bancas`, { currentPage: 'bancas', perfil });
});

app.get('/alunos', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/alunos`, { currentPage: 'alunos', perfil });
});

app.get('/cadastrar-aluno', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/CadastrarAluno`, { currentPage: 'CadastrarAluno', perfil });
});


app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});