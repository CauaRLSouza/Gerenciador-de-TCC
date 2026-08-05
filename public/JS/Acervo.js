document.addEventListener("DOMContentLoaded", () => {

    const pathAtual = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll("#BottomNav .nav-btn");

    navLinks.forEach(link => {
        const href = link.getAttribute("href").toLowerCase();
        if (pathAtual === href) {
            link.classList.add("active");
        }
    });

    const inputBusca = document.getElementById("InputBusca");
    const filtroCurso = document.getElementById("FiltroCurso");
    const filtroLinha = document.getElementById("FiltroLinhaPesquisa");
    const filtroAno = document.getElementById("FiltroAno");
    const selectOrdenacao = document.getElementById("SelectOrdenacao");
    const listaAcervo = document.getElementById("ListaAcervo");
    const contadorResultados = document.getElementById("ContadorResultados");

    function filtrarEOrdenar() {
        if (!listaAcervo) return;

        const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : "";
        const cursoSelecionado = filtroCurso ? filtroCurso.value : "";
        const linhaSelecionada = filtroLinha ? filtroLinha.value : "";
        const anoSelecionado = filtroAno ? filtroAno.value : "";
        const ordem = selectOrdenacao ? selectOrdenacao.value : "recentes";

        const cards = Array.from(listaAcervo.querySelectorAll(".card-tcc"));
        let visiveisCount = 0;

        cards.forEach(card => {
            const titulo = card.querySelector(".tcc-titulo")?.textContent.toLowerCase() || "";
            const autor = card.querySelector(".tcc-autor")?.textContent.toLowerCase() || "";
            const curso = card.dataset.curso || "";
            const linha = card.dataset.linha || "";
            const ano = card.dataset.ano || "";

            const atendeBusca = !termoBusca || titulo.includes(termoBusca) || autor.includes(termoBusca);
            const atendeCurso = !cursoSelecionado || curso === cursoSelecionado;
            const atendeLinha = !linhaSelecionada || linha === linhaSelecionada;
            const atendeAno = !anoSelecionado || ano === anoSelecionado;

            if (atendeBusca && atendeCurso && atendeLinha && atendeAno) {
                card.style.display = "flex";
                visiveisCount++;
            } else {
                card.style.display = "none";
            }
        });

        cards.sort((a, b) => {
            const tituloA = a.querySelector(".tcc-titulo")?.textContent || "";
            const tituloB = b.querySelector(".tcc-titulo")?.textContent || "";
            const anoA = parseInt(a.dataset.ano, 10) || 0;
            const anoB = parseInt(b.dataset.ano, 10) || 0;

            if (ordem === "recentes") return anoB - anoA;
            if (ordem === "antigos") return anoA - anoB;
            if (ordem === "az") return tituloA.localeCompare(tituloB);
            if (ordem === "za") return tituloB.localeCompare(tituloA);
            return 0;
        });

        cards.forEach(card => listaAcervo.appendChild(card));

        if (contadorResultados) {
            contadorResultados.textContent = `${visiveisCount} ${visiveisCount === 1 ? 'trabalho encontrado' : 'trabalhos encontrados'}`;
        }
    }

    if (inputBusca) inputBusca.addEventListener("input", filtrarEOrdenar);
    if (filtroCurso) filtroCurso.addEventListener("change", filtrarEOrdenar);
    if (filtroLinha) filtroLinha.addEventListener("change", filtrarEOrdenar);
    if (filtroAno) filtroAno.addEventListener("change", filtrarEOrdenar);
    if (selectOrdenacao) selectOrdenacao.addEventListener("change", filtrarEOrdenar);

    filtrarEOrdenar();
});