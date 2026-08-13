const estadoTcc = {
    busca: '',
    ordenacao: 'titulo-asc',
    filtros: {
        curso: '',
        linhaPesquisa: '',
        defesa: ''
    }
};

function filtroValido(valor) {
    if (!valor) return false;

    const val = String(valor).trim().toLowerCase();

    const ignorar = [
        '',
        'todos',
        'todas',
        'todos os cursos',
        'todas as linhas',
        'todas as defesas',
        'selecione'
    ];

    return !ignorar.includes(val) &&
           !val.startsWith('todos') &&
           !val.startsWith('todas');
}

function mostrarPainel(id) {
    const painel = document.getElementById(id);
    if (!painel) return;
    painel.style.removeProperty('display');
}

function esconderPainel(id) {
    const painel = document.getElementById(id);
    if (!painel) return;
    painel.style.display = 'none';
}

function alternarPainel(idAbrir, idFechar) {
    const painelAbrir = document.getElementById(idAbrir);
    const painelFechar = document.getElementById(idFechar);

    if (!painelAbrir) return;

    const estaAberto = painelAbrir.style.display !== 'none';

    if (painelFechar) {
        painelFechar.style.display = 'none';
    }

    if (estaAberto) {
        painelAbrir.style.display = 'none';
    } else {
        painelAbrir.style.removeProperty('display');
    }
}

function aplicarFiltrosEOrdenacao() {
    const container = document.getElementById('listaTccsContainer');
    const msgVazia = document.getElementById('mensagemVaziaTcc');

    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.card-tcc'));
    const termoBusca = estadoTcc.busca.toLowerCase().trim();

    let contadorVisiveis = 0;

    cards.forEach(card => {
        const aluno = card.getAttribute('data-aluno') || '';
        const titulo = card.getAttribute('data-titulo') || '';
        const curso = card.getAttribute('data-curso') || '';
        const linha = card.getAttribute('data-linha') || '';
        const defesa = card.getAttribute('data-defesa') || '';

        const matchBusca =
            !termoBusca ||
            aluno.toLowerCase().includes(termoBusca) ||
            titulo.toLowerCase().includes(termoBusca);

        const matchCurso =
            !filtroValido(estadoTcc.filtros.curso) ||
            curso.toLowerCase() === estadoTcc.filtros.curso.toLowerCase();

        const matchLinha =
            !filtroValido(estadoTcc.filtros.linhaPesquisa) ||
            linha.toLowerCase() === estadoTcc.filtros.linhaPesquisa.toLowerCase();

        const matchDefesa =
            !filtroValido(estadoTcc.filtros.defesa) ||
            defesa.toLowerCase() === estadoTcc.filtros.defesa.toLowerCase();

        const visivel =
            matchBusca &&
            matchCurso &&
            matchLinha &&
            matchDefesa;

        card.style.display = visivel ? '' : 'none';

        if (visivel) {
            contadorVisiveis++;
        }
    });

    if (msgVazia) {
        msgVazia.style.display =
            contadorVisiveis === 0 ? 'block' : 'none';
    }

    const totalEl = document.getElementById('totalTccs');
    if (totalEl) {
        totalEl.innerText = `Total: ${contadorVisiveis} TCCs Encontrados`;
    }

    cards.sort((a, b) => {
        const tituloA = a.getAttribute('data-titulo') || '';
        const tituloB = b.getAttribute('data-titulo') || '';

        const nomeA = a.getAttribute('data-aluno') || '';
        const nomeB = b.getAttribute('data-aluno') || '';

        switch (estadoTcc.ordenacao) {
            case 'titulo-desc':
                return tituloB.localeCompare(tituloA, 'pt-BR');

            case 'aluno-asc':
                return nomeA.localeCompare(nomeB, 'pt-BR');

            case 'aluno-desc':
                return nomeB.localeCompare(nomeA, 'pt-BR');

            case 'titulo-asc':
            default:
                return tituloA.localeCompare(tituloB, 'pt-BR');
        }
    });

    cards.forEach(card => {
        container.appendChild(card);
    });
}

window.filtrarTccs = function(termo) {
    estadoTcc.busca = termo || '';
    aplicarFiltrosEOrdenacao();
};

document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('inputBuscaTcc');

    if (inputBusca) {
        inputBusca.addEventListener('input', event => {
            estadoTcc.busca = event.target.value || '';
            aplicarFiltrosEOrdenacao();
        });
    }

    const btnAbrirFiltro = document.getElementById('btnAbrirFiltroTcc');
    const btnAbrirOrdenacao = document.getElementById('btnAbrirOrdenacaoTcc');

    if (btnAbrirFiltro) {
        btnAbrirFiltro.addEventListener('click', event => {
            event.preventDefault();
            alternarPainel('painelFiltrosTcc', 'painelOrdenacaoTcc');
        });
    }

    if (btnAbrirOrdenacao) {
        btnAbrirOrdenacao.addEventListener('click', event => {
            event.preventDefault();
            alternarPainel('painelOrdenacaoTcc', 'painelFiltrosTcc');
        });
    }

    const selectOrdenacao = document.getElementById('selectOrdenacaoTcc');

    if (selectOrdenacao) {
        selectOrdenacao.value = estadoTcc.ordenacao;

        selectOrdenacao.addEventListener('change', event => {
            estadoTcc.ordenacao = event.target.value;

            const opcaoSelecionada =
                selectOrdenacao.options[selectOrdenacao.selectedIndex];

            const labelOrdenacao = document.getElementById('btnAbrirOrdenacaoTcc');

            if (labelOrdenacao && opcaoSelecionada) {
                labelOrdenacao.innerText = `Ordenar: ${opcaoSelecionada.text} ▾`;
            }

            aplicarFiltrosEOrdenacao();
        });
    }

    const mapaFiltros = {
        filtroCursoTcc: 'curso',
        filtroLinhaTcc: 'linhaPesquisa',
        filtroDefesaTcc: 'defesa'
    };

    Object.keys(mapaFiltros).forEach(id => {
        const select = document.getElementById(id);

        if (!select) return;

        select.addEventListener('change', event => {
            const campo = mapaFiltros[id];
            estadoTcc.filtros[campo] = event.target.value || '';
            aplicarFiltrosEOrdenacao();
        });
    });

    esconderPainel('painelFiltrosTcc');
    esconderPainel('painelOrdenacaoTcc');

    aplicarFiltrosEOrdenacao();
});