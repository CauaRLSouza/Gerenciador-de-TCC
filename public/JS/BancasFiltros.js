const estado = {
    busca: '',
    ordenacao: 'data-proxima',
    filtros: {
        local: '',
        linhaPesquisa: '',
        curso: '',
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
        'todos os locais',
        'todas as linhas',
        'todos os cursos',
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
    const container = document.getElementById('listaBancasContainer');
    const msgVazia = document.getElementById('mensagemVazia');

    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.grupo-data'));

    const termoBusca = estado.busca.toLowerCase().trim();

    let contadorVisiveis = 0;

    cards.forEach(card => {
        const aluno = card.getAttribute('data-aluno') || '';
        const titulo = card.getAttribute('data-titulo') || '';
        const local = card.getAttribute('data-local') || '';
        const linha = card.getAttribute('data-linha') || '';
        const curso = card.getAttribute('data-curso') || '';
        const defesa = card.getAttribute('data-defesa') || '';

        const matchBusca =
            !termoBusca ||
            aluno.includes(termoBusca) ||
            titulo.includes(termoBusca);

        const matchLocal =
            !filtroValido(estado.filtros.local) ||
            local.toLowerCase() === estado.filtros.local.toLowerCase();

        const matchLinha =
            !filtroValido(estado.filtros.linhaPesquisa) ||
            linha.toLowerCase() === estado.filtros.linhaPesquisa.toLowerCase();

        const matchCurso =
            !filtroValido(estado.filtros.curso) ||
            curso.toLowerCase() === estado.filtros.curso.toLowerCase();

        const matchDefesa =
            !filtroValido(estado.filtros.defesa) ||
            defesa.toLowerCase() === estado.filtros.defesa.toLowerCase();

        const visivel =
            matchBusca &&
            matchLocal &&
            matchLinha &&
            matchCurso &&
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

    const totalEl = document.getElementById('totalBancas');

    if (totalEl) {
        totalEl.innerText =
            `Total: ${contadorVisiveis} Bancas Agendadas`;
    }

    cards.sort((a, b) => {
        const nomeA = a.getAttribute('data-aluno') || '';
        const nomeB = b.getAttribute('data-aluno') || '';

        const tituloA = a.getAttribute('data-titulo') || '';
        const tituloB = b.getAttribute('data-titulo') || '';

        const isoA = new Date(
            a.getAttribute('data-iso') || '2099-12-31'
        );

        const isoB = new Date(
            b.getAttribute('data-iso') || '2099-12-31'
        );

        switch (estado.ordenacao) {
            case 'data-distante':
                return isoB - isoA;

            case 'nome-asc':
                return nomeA.localeCompare(nomeB, 'pt-BR');

            case 'nome-desc':
                return nomeB.localeCompare(nomeA, 'pt-BR');

            case 'titulo-asc':
                return tituloA.localeCompare(tituloB, 'pt-BR');

            case 'titulo-desc':
                return tituloB.localeCompare(tituloA, 'pt-BR');

            case 'data-proxima':
            default:
                return isoA - isoB;
        }
    });

    cards.forEach(card => {
        container.appendChild(card);
    });
}

window.filtrarBancas = function(termo) {
    estado.busca = termo || '';
    aplicarFiltrosEOrdenacao();
};

document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('inputBusca');

    if (inputBusca) {
        inputBusca.addEventListener('input', event => {
            estado.busca = event.target.value || '';
            aplicarFiltrosEOrdenacao();
        });
    }

    const btnAbrirFiltro =
        document.getElementById('btnAbrirFiltro');

    const painelFiltros =
        document.getElementById('painelFiltros');

    const painelOrdenacao =
        document.getElementById('painelOrdenacao');

    const btnAbrirOrdenacao =
        document.getElementById('btnAbrirOrdenacao');

    if (btnAbrirFiltro) {
        btnAbrirFiltro.addEventListener('click', event => {
            event.preventDefault();

            alternarPainel(
                'painelFiltros',
                'painelOrdenacao'
            );
        });
    }

    if (btnAbrirOrdenacao) {
        btnAbrirOrdenacao.addEventListener('click', event => {
            event.preventDefault();

            alternarPainel(
                'painelOrdenacao',
                'painelFiltros'
            );
        });
    }

    const selectOrdenacao =
        document.getElementById('selectOrdenacao');

    if (selectOrdenacao) {
        selectOrdenacao.value = estado.ordenacao;

        selectOrdenacao.addEventListener('change', event => {
            estado.ordenacao = event.target.value;

            const opcaoSelecionada =
                selectOrdenacao.options[
                    selectOrdenacao.selectedIndex
                ];

            const labelOrdenacao =
                document.getElementById('btnAbrirOrdenacao');

            if (labelOrdenacao && opcaoSelecionada) {
                labelOrdenacao.innerText =
                    `Ordenar: ${opcaoSelecionada.text} ▾`;
            }

            aplicarFiltrosEOrdenacao();
        });
    }

    const mapaFiltros = {
        filtroLocal: 'local',
        filtroLinha: 'linhaPesquisa',
        filtroCurso: 'curso',
        filtroDefesa: 'defesa'
    };

    Object.keys(mapaFiltros).forEach(id => {
        const select = document.getElementById(id);

        if (!select) return;

        select.addEventListener('change', event => {
            const campo = mapaFiltros[id];

            estado.filtros[campo] =
                event.target.value || '';

            aplicarFiltrosEOrdenacao();
        });
    });

    esconderPainel('painelFiltros');
    esconderPainel('painelOrdenacao');

    aplicarFiltrosEOrdenacao();
});