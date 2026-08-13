const express = require('express');
const path = require('path');

const {
    usuariosMock,
    todosProfessoresMock,
    todosAlunosMock,
    todosTccsMock,
    bancasAgendadasMock,
    gerarIniciais
} = require('./mocks');

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
        orientandos: todosAlunosMock.slice(0, 3)
    });
});

app.get('/orientando/:id', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Professor';
    const alunoId = req.params.id;

    const orientandoEncontrado = todosAlunosMock.find(a => String(a.id) === String(alunoId));

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

app.get(['/tccs', '/tcc', '/TCC', '/TCCs'], proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';

    const tccsMapeados = todosTccsMock.map(tcc => {
        const orientador = todosProfessoresMock.find(p => String(p.id) === String(tcc.orientadorId)) || { nome: tcc.orientador || 'Não informado' };
        const coorientador = todosProfessoresMock.find(p => String(p.id) === String(tcc.coorientadorId)) || (tcc.coorientador ? { nome: tcc.coorientador } : null);

        return {
            ...tcc,
            orientadorNome: orientador.nome,
            coorientadorNome: coorientador ? coorientador.nome : null
        };
    });

    res.render(`${perfil}/TCC`, { 
        currentPage: 'tcc', 
        perfil, 
        tccs: tccsMapeados 
    });
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
    const perfil = req.query.perfil || 'Secretariado';
    res.render(`${perfil}/Bancas`, { currentPage: 'bancas', perfil, bancas: bancasAgendadasMock });
});

app.get('/alunos', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    res.render(`${perfil}/alunos`, { 
        currentPage: 'alunos', 
        perfil,
        orientandos: todosAlunosMock
    });
});

app.get('/professores', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    const professoresComIniciais = todosProfessoresMock.map(prof => ({
        ...prof,
        iniciais: gerarIniciais(prof.nome)
    }));

    res.render(`${perfil}/Professores`, { 
        currentPage: 'professores', 
        perfil,
        professores: professoresComIniciais
    });
});

app.get('/cadastrar-aluno', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/CadastrarAluno`, { currentPage: 'CadastrarAluno', perfil });
});

app.get('/cadastrar-professor', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    res.render(`${perfil}/CadastrarProfessor`, { currentPage: 'CadastrarProfessor', perfil });
});

app.get(['/cadastrar-tcc', '/CadastrarTCC'], proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';

    const alunosOrdenados = [...todosAlunosMock].sort((a, b) => 
        a.nome.localeCompare(b.nome, 'pt-BR')
    );

    const professoresOrdenados = [...todosProfessoresMock]
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(prof => ({
            ...prof,
            rotulo: `${prof.nome} (${prof.titulacao})`
        }));

    res.render(`${perfil}/CadastrarTCC`, { 
        currentPage: 'cadastrar-tcc', 
        perfil,
        alunos: alunosOrdenados,
        professores: professoresOrdenados
    });
});

app.post('/cadastrar-tcc', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    const { titulo, alunoId, orientadorId, coorientadorId } = req.body;

    res.redirect(`/alunos?perfil=${perfil}`);
});

app.get(['/agendar-banca', '/AgendarBanca'], proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';

    const professoresOrdenados = [...todosProfessoresMock]
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(prof => ({
            ...prof,
            rotulo: `${prof.nome} (${prof.titulacao})`
        }));

    res.render(`${perfil}/AgendarBanca`, {
        currentPage: 'agendar-banca',
        perfil,
        tccs: todosTccsMock,
        professores: professoresOrdenados
    });
});

app.post('/agendar-banca', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    const { tccId, data, horario, local, bancaMembros } = req.body;

    const novaBanca = {
        id: String(bancasAgendadasMock.length + 1),
        tccId,
        data,
        horario,
        local,
        membros: Array.isArray(bancaMembros) ? bancaMembros : [bancaMembros]
    };

    bancasAgendadasMock.push(novaBanca);

    res.redirect(`/Bancas?perfil=${perfil}`);
});

app.get(['/DetalharAluno/:id', '/detalhar-aluno/:id'], proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Secretariado';
    const alunoId = req.params.id;

    const alunoEncontrado = todosAlunosMock.find(a => String(a.id) === String(alunoId));

    if (!alunoEncontrado) {
        return res.status(404).send('<h1>Aluno não encontrado</h1>');
    }

    alunoEncontrado.iniciais = gerarIniciais(alunoEncontrado.nome);

    res.render(`${perfil}/DetalhesAluno`, { 
        currentPage: 'alunos', 
        perfil, 
        aluno: alunoEncontrado,
        orientando: alunoEncontrado,
        alunoId: alunoEncontrado.id
    });
});

app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});