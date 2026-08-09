const express = require('express');
const path = path = require('path');

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

const todosAlunosMock = [
    { id: '1', nome: 'João da Silva', matricula: '202410101', curso: 'Licenciatura em Ciências da Computação', semestre: '2024.2', dataIngresso: '2024-07-10', email: 'joao.silva@aluno.edu.br', tituloTCC: 'Desenvolvimento de um sistema de gerenciamento acadêmico utilizando tecnologias web', dataInicio: '10/03/2025', previsaoConclusao: '15/12/2025', linhaPesquisa: 'Engenharia de Software', status: 'Aguardando revisão', statusCor: 'yellow' },
    { id: '2', nome: 'Maria Santos', matricula: '202310102', curso: 'Licenciatura em Ciências da Computação', semestre: '2023.1', dataIngresso: '2023-02-15', email: 'maria.santos@aluno.edu.br', tituloTCC: 'Arquiteturas de Microserviços e Resiliência em Sistemas Distribuídos', dataInicio: '15/02/2025', previsaoConclusao: '10/12/2025', linhaPesquisa: 'Sistemas Distribuídos', status: 'Revisada', statusCor: 'green' },
    { id: '3', nome: 'Carlos Correia', matricula: '202510103', curso: 'Licenciatura em Ciências da Computação', semestre: '2025.1', dataIngresso: '2025-02-15', email: 'carlos.correia@aluno.edu.br', tituloTCC: 'Análise de Desempenho e Algoritmos de Machine Learning na Detecção de Anomalias', dataInicio: '01/04/2025', previsaoConclusao: '20/12/2025', linhaPesquisa: 'Inteligência Artificial', status: 'Revisada', statusCor: 'green' },
    { id: '4', nome: 'Ana Beatriz Souza', matricula: '202210104', curso: 'Licenciatura em Ciências Agrárias', semestre: '2022.1', dataIngresso: '2022-02-20', email: 'ana.souza@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '5', nome: 'Bruno Ferreira', matricula: '202310105', curso: 'Licenciatura em Química', semestre: '2023.2', dataIngresso: '2023-07-15', email: 'bruno.ferreira@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '6', nome: 'Camila Oliveira', matricula: '202410106', curso: 'Bacharel em Administração', semestre: '2024.1', dataIngresso: '2024-02-28', email: 'camila.oliveira@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '7', nome: 'Daniel Costa', matricula: '202510107', curso: 'Licenciatura em Ciências da Computação', semestre: '2025.2', dataIngresso: '2025-07-10', email: 'daniel.costa@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '8', nome: 'Eduarda Lima', matricula: '202110108', curso: 'Licenciatura em Ciências Agrárias', semestre: '2021.2', dataIngresso: '2021-07-18', email: 'eduarda.lima@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '9', nome: 'Felipe Rocha', matricula: '202210109', curso: 'Licenciatura em Química', semestre: '2022.2', dataIngresso: '2022-07-22', email: 'felipe.rocha@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '10', nome: 'Gabriela Alves', matricula: '202310110', curso: 'Bacharel em Administração', semestre: '2023.1', dataIngresso: '2023-02-10', email: 'gabriela.alves@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '11', nome: 'Gabriel Santos', matricula: '202410111', curso: 'Licenciatura em Ciências da Computação', semestre: '2024.2', dataIngresso: '2024-07-30', email: 'gabriel.santos@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '12', nome: 'Heitor Martins', matricula: '202510112', curso: 'Licenciatura em Ciências Agrárias', semestre: '2025.1', dataIngresso: '2025-02-15', email: 'heitor.martins@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '13', nome: 'Isabela Ribeiro', matricula: '202110113', curso: 'Licenciatura em Química', semestre: '2021.1', dataIngresso: '2021-02-10', email: 'isabela.ribeiro@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '14', nome: 'Lucas Mendes', matricula: '202210114', curso: 'Bacharel em Administração', semestre: '2022.2', dataIngresso: '2022-07-15', email: 'lucas.mendes@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '15', nome: 'Mariana Barbosa', matricula: '202310115', curso: 'Licenciatura em Ciências da Computação', semestre: '2023.2', dataIngresso: '2023-07-20', email: 'mariana.barbosa@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '16', nome: 'Matheus Fernandes', matricula: '202410116', curso: 'Licenciatura em Ciências Agrárias', semestre: '2024.1', dataIngresso: '2024-02-10', email: 'matheus.fernandes@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '17', nome: 'Nathalia Carvalho', matricula: '202510117', curso: 'Licenciatura em Química', semestre: '2025.2', dataIngresso: '2025-07-18', email: 'nathalia.carvalho@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '18', nome: 'Otávio Teixeira', matricula: '202110118', curso: 'Bacharel em Administração', semestre: '2021.2', dataIngresso: '2021-07-05', email: 'otavio.teixeira@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '19', nome: 'Patricia Gomes', matricula: '202210119', curso: 'Licenciatura em Ciências da Computação', semestre: '2022.1', dataIngresso: '2022-02-15', email: 'patricia.gomes@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '20', nome: 'Rafael Cardoso', matricula: '202310120', curso: 'Licenciatura em Ciências Agrárias', semestre: '2023.1', dataIngresso: '2023-02-28', email: 'rafael.cardoso@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '21', nome: 'Sophia Monteiro', matricula: '202410121', curso: 'Licenciatura em Química', semestre: '2024.2', dataIngresso: '2024-07-12', email: 'sophia.monteiro@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '22', nome: 'Thiago Nunes', matricula: '202510122', curso: 'Bacharel em Administração', semestre: '2025.1', dataIngresso: '2025-02-20', email: 'thiago.nunes@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '23', nome: 'Vinícius Moreira', matricula: '202110123', curso: 'Licenciatura em Ciências da Computação', semestre: '2021.1', dataIngresso: '2021-02-25', email: 'vinicius.moreira@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '24', nome: 'Yasmin Vieira', matricula: '202210124', curso: 'Licenciatura em Ciências Agrárias', semestre: '2022.2', dataIngresso: '2022-07-10', email: 'yasmin.vieira@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '25', nome: 'Igor Cavalcante', matricula: '202310125', curso: 'Licenciatura em Química', semestre: '2023.2', dataIngresso: '2023-07-05', email: 'igor.cavalcante@aluno.edu.br', status: 'Ativo', statusCor: 'green' },
    { id: '26', nome: 'Letícia Freitas', matricula: '202410126', curso: 'Bacharel em Administração', semestre: '2024.1', dataIngresso: '2024-02-18', email: 'leticia.freitas@aluno.edu.br', status: 'Ativo', statusCor: 'green' }
];

function proibirAcessoDireto(req, res, next) {
    const referer = req.headers.referer;

    if (!referer) {
        return res.redirect('/login');
    }

    next();
}

function gerarIniciais(nome) {
    if (!nome) return '';
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
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
    const perfil = req.query.perfil || 'Secretariado';
    res.render(`${perfil}/alunos`, { 
        currentPage: 'alunos', 
        perfil,
        orientandos: todosAlunosMock
    });
});

app.get('/cadastrar-aluno', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Aluno';
    res.render(`${perfil}/CadastrarAluno`, { currentPage: 'CadastrarAluno', perfil });
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