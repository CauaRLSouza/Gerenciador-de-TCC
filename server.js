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

function obterVersoesPadrao(alunoNome) {
    const nomeLower = alunoNome.toLowerCase();
    
    if (nomeLower.includes('beatriz') || nomeLower.includes('carlos')) {
        return [
            { id: 1, titulo: 'Versão Inicial TCC - Introdução e Objetivos', data: '15/08/2025' },
            { id: 2, titulo: 'Segunda Versão - Metodologia e Parcial', data: '10/09/2025' }
        ];
    }
    
    if (nomeLower.includes('maria')) {
        return [
            { id: 1, titulo: 'Versão Inicial TCC - Introdução e Objetivos', data: '15/08/2025' }
        ];
    }
    
    if (nomeLower.includes('joao')) {
        return [
            { id: 1, titulo: 'Versão Inicial TCC - Introdução e Objetivos', data: '10/03/2025' },
            { id: 2, titulo: 'Segunda Versão - Referencial Teórico', data: '15/05/2025' },
            { id: 3, titulo: 'Terceira Versão - Metodologia Aplicada', data: '20/07/2025' },
            { id: 4, titulo: 'Quarta Versão - Resultados e Discussões', data: '10/10/2025' },
            { id: 5, titulo: 'Versão Final - TCC Concluído e Formatado', data: '05/12/2025' }
        ];
    }

    return [{ id: 1, titulo: 'Versão Inicial TCC - Introdução e Objetivos', data: '15/08/2025' }];
}

function processarVersoesAluno(aluno) {
    const nomeLower = aluno.nome.toLowerCase();
    
    if (nomeLower.includes('joao') || nomeLower.includes('beatriz') || nomeLower.includes('carlos') || nomeLower.includes('maria')) {
        return obterVersoesPadrao(aluno.nome);
    }
    
    const tcc = todosTccsMock.find(t => String(t.alunoId) === String(aluno.id));
    
    if (Array.isArray(aluno.versoes) && aluno.versoes.length > 0) {
        return aluno.versoes;
    }
    
    if (tcc && Array.isArray(tcc.versoes) && tcc.versoes.length > 0) {
        return tcc.versoes;
    }
    
    return obterVersoesPadrao(aluno.nome);
}

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
    
    const professorPedro = todosProfessoresMock.find(p => p.nome.includes('Pedro Felipe')) || todosProfessoresMock[0];
    
    let orientandosDoProfessor = [];
    
    if (professorPedro) {
        const tccsDoProfessor = todosTccsMock.filter(t => String(t.orientadorId) === String(professorPedro.id));
        const idsAlunos = tccsDoProfessor.map(t => String(t.alunoId));
        
        orientandosDoProfessor = todosAlunosMock.filter(aluno => 
            idsAlunos.includes(String(aluno.id)) || String(aluno.orientadorId) === String(professorPedro.id)
        );
    }

    if (orientandosDoProfessor.length === 0) {
        orientandosDoProfessor = todosAlunosMock.slice(0, 4);
    }

    const orientandosFormatados = orientandosDoProfessor.map(aluno => {
        const tcc = todosTccsMock.find(t => String(t.alunoId) === String(aluno.id));
        const versoesTratadas = processarVersoesAluno(aluno);
        const ultimaVersaoObj = versoesTratadas[versoesTratadas.length - 1];
        const dataVersao = aluno.ultimaVersao || aluno.versaoAtual || ultimaVersaoObj.data;

        return {
            ...aluno,
            iniciais: gerarIniciais(aluno.nome),
            tituloTCC: tcc ? tcc.titulo : (aluno.tituloTCC || 'Não informado'),
            linhaPesquisa: tcc ? tcc.linhaPesquisa : (aluno.linhaPesquisa || 'Não informada'),
            dataInicio: aluno.dataInicio || '10/03/2025',
            previsaoConclusao: aluno.previsaoConclusao || '15/12/2025',
            versaoAtual: ultimaVersaoObj.titulo,
            ultimaVersao: dataVersao,
            versoes: versoesTratadas
        };
    });

    res.render(`${perfil}/Orientandos`, { 
        currentPage: 'orientandos', 
        perfil,
        orientandos: orientandosFormatados
    });
});

app.get('/orientando/:id', proibirAcessoDireto, (req, res) => {
    const perfil = req.query.perfil || 'Professor';
    const alunoId = req.params.id;

    const orientandoEncontrado = todosAlunosMock.find(a => String(a.id) === String(alunoId));

    if (!orientandoEncontrado) {
        return res.status(404).send('<h1>Orientando não encontrado</h1>');
    }

    const tcc = todosTccsMock.find(t => String(t.alunoId) === String(alunoId));
    const versoesTratadas = processarVersoesAluno(orientandoEncontrado);

    const alunoTratado = {
        ...orientandoEncontrado,
        iniciais: gerarIniciais(orientandoEncontrado.nome),
        tituloTCC: tcc ? tcc.titulo : (orientandoEncontrado.tituloTCC || 'Não informado'),
        linhaPesquisa: tcc ? tcc.linhaPesquisa : (orientandoEncontrado.linhaPesquisa || 'Não informada'),
        dataInicio: orientandoEncontrado.dataInicio || '10/03/2025',
        previsaoConclusao: orientandoEncontrado.previsaoConclusao || '15/12/2025',
        versoes: versoesTratadas
    };

    res.render(`${perfil}/OrientandoDetalhes`, { 
        currentPage: 'orientandos', 
        perfil, 
        aluno: alunoTratado,
        orientando: alunoTratado,
        orientandoId: alunoTratado.id
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
    
    const alunosFormatados = todosAlunosMock.map(aluno => {
        const tcc = todosTccsMock.find(t => String(t.alunoId) === String(aluno.id));
        const versoesTratadas = processarVersoesAluno(aluno);

        return {
            ...aluno,
            iniciais: gerarIniciais(aluno.nome),
            tituloTCC: tcc ? tcc.titulo : (aluno.tituloTCC || 'Não informado'),
            linhaPesquisa: tcc ? tcc.linhaPesquisa : (aluno.linhaPesquisa || 'Não informada'),
            dataInicio: aluno.dataInicio || '10/03/2025',
            previsaoConclusao: aluno.previsaoConclusao || '15/12/2025',
            versoes: versoesTratadas
        };
    });

    res.render(`${perfil}/alunos`, { 
        currentPage: 'alunos', 
        perfil,
        orientandos: alunosFormatados
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

    const tcc = todosTccsMock.find(t => String(t.alunoId) === String(alunoId));
    const versoesTratadas = processarVersoesAluno(alunoEncontrado);

    const alunoTratado = {
        ...alunoEncontrado,
        iniciais: gerarIniciais(alunoEncontrado.nome),
        tituloTCC: tcc ? tcc.titulo : (alunoEncontrado.tituloTCC || 'Não informado'),
        linhaPesquisa: tcc ? tcc.linhaPesquisa : (alunoEncontrado.linhaPesquisa || 'Não informada'),
        dataInicio: alunoEncontrado.dataInicio || '10/03/2025',
        previsaoConclusao: alunoEncontrado.previsaoConclusao || '15/12/2025',
        versoes: versoesTratadas
    };

    res.render(`${perfil}/DetalhesAluno`, { 
        currentPage: 'alunos', 
        perfil, 
        aluno: alunoTratado,
        orientando: alunoTratado,
        alunoId: alunoTratado.id
    });
});

app.use((req, res) => {
    res.status(404).send('<h1>Página não encontrada (404)</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});