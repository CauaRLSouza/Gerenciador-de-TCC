document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.getElementById("InputBusca");
    const filtroCurso = document.getElementById("FiltroCurso");
    const filtroLinhaPesquisa = document.getElementById("FiltroLinhaPesquisa");
    const filtroAno = document.getElementById("FiltroAno");
    const selectOrdenacao = document.getElementById("SelectOrdenacao");
    const contadorResultados = document.getElementById("ContadorResultados");
    const listaAcervo = document.getElementById("ListaAcervo");
    
    const cardsArray = Array.from(listaAcervo.querySelectorAll(".card-tcc"));

    function carregarEstadoDaURL() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has("busca")) inputBusca.value = urlParams.get("busca");
        if (urlParams.has("curso")) filtroCurso.value = urlParams.get("curso");
        if (urlParams.has("linha")) filtroLinhaPesquisa.value = urlParams.get("linha");
        if (urlParams.has("ano")) filtroAno.value = urlParams.get("ano");
        if (urlParams.has("ordem")) selectOrdenacao.value = urlParams.get("ordem");
    }

    function atualizarURL() {
        const url = new URL(window.location);

        inputBusca.value.trim() ? url.searchParams.set("busca", inputBusca.value.trim()) : url.searchParams.delete("busca");
        filtroCurso.value ? url.searchParams.set("curso", filtroCurso.value) : url.searchParams.delete("curso");
        filtroLinhaPesquisa.value ? url.searchParams.set("linha", filtroLinhaPesquisa.value) : url.searchParams.delete("linha");
        filtroAno.value ? url.searchParams.set("ano", filtroAno.value) : url.searchParams.delete("ano");
        selectOrdenacao.value ? url.searchParams.set("ordem", selectOrdenacao.value) : url.searchParams.delete("ordem");

        window.history.replaceState({}, "", url);
    }

    function aplicarFiltrosEOordenacao() {
        const termoBusca = inputBusca.value.toLowerCase().trim();
        const cursoSelecionado = filtroCurso.value;
        const linhaSelecionada = filtroLinhaPesquisa.value;
        const anoSelecionado = filtroAno.value;
        const ordemSelecionada = selectOrdenacao.value;

        const cardsVisiveis = cardsArray.filter(card => {
            const titulo = card.querySelector(".tcc-titulo").textContent.toLowerCase();
            const autor = card.querySelector(".tcc-autor").textContent.toLowerCase();
            const cursoCard = card.dataset.curso || "";
            const linhaCard = card.dataset.linha || "";
            const anoCard = card.dataset.ano || "";

            const bateBusca = !termoBusca || titulo.includes(termoBusca) || autor.includes(termoBusca);
            const bateCurso = !cursoSelecionado || cursoCard === cursoSelecionado;
            const bateLinha = !linhaSelecionada || linhaCard === linhaSelecionada;
            const bateAno = !anoSelecionado || anoCard === anoSelecionado;

            return bateBusca && bateCurso && bateLinha && bateAno;
        });

        cardsVisiveis.sort((a, b) => {
            const tituloA = a.querySelector(".tcc-titulo").textContent.trim();
            const tituloB = b.querySelector(".tcc-titulo").textContent.trim();
            const anoA = parseInt(a.dataset.ano, 10) || 0;
            const anoB = parseInt(b.dataset.ano, 10) || 0;

            switch (ordemSelecionada) {
                case "recentes":
                    return anoB - anoA;
                case "antigos":
                    return anoA - anoB;
                case "az":
                    return tituloA.localeCompare(tituloB, 'pt-BR');
                case "za":
                    return tituloB.localeCompare(tituloA, 'pt-BR');
                default:
                    return 0;
            }
        });

        cardsArray.forEach(card => card.style.display = "none");
        cardsVisiveis.forEach(card => {
            card.style.display = "flex";
            listaAcervo.appendChild(card);
        });

        const total = cardsVisiveis.length;
        contadorResultados.textContent = `${total} ${total === 1 ? 'trabalho encontrado' : 'trabalhos encontrados'}`;

        atualizarURL();
    }

    carregarEstadoDaURL();
    aplicarFiltrosEOordenacao();

    inputBusca.addEventListener("input", aplicarFiltrosEOordenacao);
    filtroCurso.addEventListener("change", aplicarFiltrosEOordenacao);
    filtroLinhaPesquisa.addEventListener("change", aplicarFiltrosEOordenacao);
    filtroAno.addEventListener("change", aplicarFiltrosEOordenacao);
    selectOrdenacao.addEventListener("change", aplicarFiltrosEOordenacao);
});