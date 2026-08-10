document.addEventListener('DOMContentLoaded', () => {
    const btnToggleFiltros = document.getElementById('btnToggleFiltros');
    const painelFiltros = document.getElementById('painelFiltros');
    const inputBusca = document.getElementById('inputBusca');
    const selectOrdenar = document.getElementById('selectOrdenar');
    const selectTitularidade = document.getElementById('selectTitularidade');
    const containerLista = document.getElementById('gridProfessores');
    
    if (!containerLista) return;

    const professoresItens = Array.from(containerLista.querySelectorAll('.item-professor'));

    let mensagemVazia = document.getElementById('mensagemVaziaProfessores');
    if (!mensagemVazia) {
        mensagemVazia = document.createElement('div');
        mensagemVazia.id = 'mensagemVaziaProfessores';
        mensagemVazia.style.display = 'none';
        mensagemVazia.style.padding = '24px 16px';
        mensagemVazia.style.textAlign = 'center';
        mensagemVazia.style.color = 'var(--text-2, #8e8e93)';
        mensagemVazia.style.fontSize = '0.9rem';
        mensagemVazia.textContent = 'Nenhum professor encontrado.';
        containerLista.parentNode.appendChild(mensagemVazia);
    }

    if (btnToggleFiltros && painelFiltros) {
        btnToggleFiltros.addEventListener('click', () => {
            painelFiltros.classList.toggle('ativo');
        });
    }

    // 1. Restaurar os filtros a partir da URL (se existirem)
    const urlParams = new URLSearchParams(window.location.search);
    
    if (inputBusca && urlParams.has('busca')) {
        inputBusca.value = urlParams.get('busca');
    }
    if (selectOrdenar && urlParams.has('ordem')) {
        selectOrdenar.value = urlParams.get('ordem');
    }
    if (selectTitularidade && urlParams.has('titularidade')) {
        selectTitularidade.value = urlParams.get('titularidade');
    }

    // Se houver algum filtro ativo no carregamento, mantém o painel de filtros aberto
    if ((urlParams.get('titularidade') && urlParams.get('titularidade') !== 'todas') || 
        (urlParams.get('ordem') && urlParams.get('ordem') !== 'az')) {
        if (painelFiltros) painelFiltros.classList.add('ativo');
    }

    // 2. Atualizar a URL sem dar reload na página
    function atualizarURL(busca, ordem, titularidade) {
        const params = new URLSearchParams(window.location.search);

        if (busca) params.set('busca', busca);
        else params.delete('busca');

        if (ordem && ordem !== 'az') params.set('ordem', ordem);
        else params.delete('ordem');

        if (titularidade && titularidade !== 'todas') params.set('titularidade', titularidade);
        else params.delete('titularidade');

        const novaURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', novaURL);
    }

    function processarProfessores() {
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
        const ordem = selectOrdenar ? selectOrdenar.value : 'az';
        const titularidadeFiltro = selectTitularidade ? selectTitularidade.value.toLowerCase() : 'todas';

        // Atualiza os parâmetros na URL para manter o estado no F5
        atualizarURL(inputBusca ? inputBusca.value.trim() : '', ordem, titularidadeFiltro);

        const visiveis = professoresItens.filter(item => {
            const nome = (item.dataset.nome || '').toLowerCase();
            const email = (item.dataset.email || '').toLowerCase();
            const titularidade = (item.dataset.titularidade || '').toLowerCase();

            const passaBusca = !termoBusca || nome.includes(termoBusca) || email.includes(termoBusca);
            
            let passaTitularidade = true;
            if (titularidadeFiltro !== 'todas') {
                switch (titularidadeFiltro) {
                    case 'graduacao':
                        passaTitularidade = titularidade.includes('gradua') || titularidade.includes('bacharel') || titularidade.includes('licencia');
                        break;
                    case 'especializacao':
                        passaTitularidade = titularidade.includes('especial');
                        break;
                    case 'mestrado':
                        passaTitularidade = titularidade.includes('mestre') || titularidade.includes('mestra') || titularidade.includes('mestrado');
                        break;
                    case 'doutorado':
                        passaTitularidade = titularidade.includes('doutor') || titularidade.includes('doutora') || titularidade.includes('doutorado') || titularidade.includes('pós-doutor');
                        break;
                    default:
                        passaTitularidade = true;
                }
            }

            return passaBusca && passaTitularidade;
        });

        visiveis.sort((a, b) => {
            const nomeA = a.dataset.nome || '';
            const nomeB = b.dataset.nome || '';
            const qtdA = parseInt(a.dataset.orientandos || '0', 10);
            const qtdB = parseInt(b.dataset.orientandos || '0', 10);

            switch (ordem) {
                case 'az':
                    return nomeA.localeCompare(nomeB, 'pt-BR');
                case 'za':
                    return nomeB.localeCompare(nomeA, 'pt-BR');
                case 'mais_orientandos':
                    return qtdB - qtdA;
                case 'menos_orientandos':
                    return qtdA - qtdB;
                default:
                    return 0;
            }
        });

        professoresItens.forEach(item => item.style.display = 'none');

        if (visiveis.length === 0) {
            containerLista.style.display = 'none';
            mensagemVazia.style.display = 'block';
        } else {
            containerLista.style.display = 'flex';
            mensagemVazia.style.display = 'none';
            visiveis.forEach(item => {
                item.style.display = 'flex';
                containerLista.appendChild(item);
            });
        }
    }

    if (inputBusca) inputBusca.addEventListener('input', processarProfessores);
    if (selectOrdenar) selectOrdenar.addEventListener('change', processarProfessores);
    if (selectTitularidade) selectTitularidade.addEventListener('change', processarProfessores);

    processarProfessores();
});