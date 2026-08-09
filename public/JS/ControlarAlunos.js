document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('inputBusca');
    const selectCurso = document.getElementById('selectFiltroCurso');
    const selectSemestre = document.getElementById('selectFiltroSemestre');
    const selectOrdenar = document.getElementById('selectOrdenar');
    const gridAlunos = document.getElementById('gridAlunos');

    function sincronizarURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (inputBusca && inputBusca.value.trim()) params.set('busca', inputBusca.value.trim());
        else params.delete('busca');

        if (selectCurso && selectCurso.value) params.set('curso', selectCurso.value);
        else params.delete('curso');

        if (selectSemestre && selectSemestre.value) params.set('semestre', selectSemestre.value);
        else params.delete('semestre');

        if (selectOrdenar && selectOrdenar.value) params.set('ordem', selectOrdenar.value);
        else params.delete('ordem');

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }

    function aplicarFiltros() {
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : '';
        const cursoSelecionado = selectCurso ? selectCurso.value : '';
        const semestreSelecionado = selectSemestre ? selectSemestre.value : '';

        const cards = document.querySelectorAll('#gridAlunos .item-aluno');

        cards.forEach(card => {
            const nome = (card.getAttribute('data-nome') || '').toLowerCase();
            const curso = card.getAttribute('data-curso') || '';
            const semestre = card.getAttribute('data-semestre') || '';

            const atendeBusca = !termoBusca || nome.includes(termoBusca);
            const atendeCurso = !cursoSelecionado || curso === cursoSelecionado;
            const atendeSemestre = !semestreSelecionado || semestre === semestreSelecionado;

            if (atendeBusca && atendeCurso && atendeSemestre) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        sincronizarURL();
    }

    function ordenarLista(criterio) {
        if (!gridAlunos) return;

        const cardsArray = Array.from(gridAlunos.querySelectorAll('.item-aluno'));

        cardsArray.sort((a, b) => {
            const nomeA = (a.getAttribute('data-nome') || '').toLowerCase();
            const nomeB = (b.getAttribute('data-nome') || '').toLowerCase();
            
            const IngressoA = a.getAttribute('data-Ingresso') || '';
            const IngressoB = b.getAttribute('data-Ingresso') || '';
            
            const semestreA = a.getAttribute('data-semestre') || '';
            const semestreB = b.getAttribute('data-semestre') || '';

            switch (criterio) {
                case 'az':
                    return nomeA.localeCompare(nomeB);
                case 'za':
                    return nomeB.localeCompare(nomeA);
                case 'Ingresso_recente':
                    return IngressoB.localeCompare(IngressoA);
                case 'Ingresso_antigo':
                    return IngressoA.localeCompare(IngressoB);
                case 'semestre_crescente':
                    return semestreA.localeCompare(semestreB);
                case 'semestre_decrescente':
                    return semestreB.localeCompare(semestreA);
                default:
                    return 0;
            }
        });

        cardsArray.forEach(card => gridAlunos.appendChild(card));
        sincronizarURL();
    }

    function inicializarDoURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('busca') && inputBusca) inputBusca.value = params.get('busca');
        if (params.get('curso') && selectCurso) selectCurso.value = params.get('curso');
        if (params.get('semestre') && selectSemestre) selectSemestre.value = params.get('semestre');
        if (params.get('ordem') && selectOrdenar) selectOrdenar.value = params.get('ordem');

        const criterioAtual = selectOrdenar ? selectOrdenar.value : 'az';
        ordenarLista(criterioAtual);
        aplicarFiltros();
    }

    if (inputBusca) inputBusca.addEventListener('input', aplicarFiltros);
    if (selectCurso) selectCurso.addEventListener('change', aplicarFiltros);
    if (selectSemestre) selectSemestre.addEventListener('change', aplicarFiltros);
    if (selectOrdenar) selectOrdenar.addEventListener('change', (e) => ordenarLista(e.target.value));

    inicializarDoURL();
});