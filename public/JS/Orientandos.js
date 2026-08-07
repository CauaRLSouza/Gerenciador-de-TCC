document.addEventListener("DOMContentLoaded", () => {
    const tema = localStorage.getItem("tema_app") || "sistema";
    if (tema === "escuro" || (tema === "sistema" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.setAttribute("data-tema", "escuro");
        document.body.setAttribute("data-tema", "escuro");
    }

    const pathAtual = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll("#BottomNav .nav-btn");
    navLinks.forEach(link => {
        const href = link.getAttribute("href").toLowerCase();
        const rotaBaseHref = href.split('?')[0];
        if (pathAtual === rotaBaseHref || (pathAtual === "/" && rotaBaseHref.includes("/dashboard"))) {
            link.classList.add("ativo", "active");
        }
    });

    const inputBusca = document.getElementById('inputBusca');
    const btnFiltro = document.getElementById('btnFiltro');
    const cards = document.querySelectorAll('.card-orientando');

    if (!inputBusca || !cards.length) return;

    let statusSelecionado = 'todos';

    let modalFiltro = document.getElementById('modalFiltroOpcoes');
    if (!modalFiltro) {
        modalFiltro = document.createElement('div');
        modalFiltro.id = 'modalFiltroOpcoes';
        modalFiltro.style.cssText = `
            display: none;
            position: absolute;
            top: 50px;
            right: 0;
            background: var(--card-bg, #ffffff);
            border: 1px solid var(--border, #cccccc);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 100;
            padding: 8px 0;
            min-width: 180px;
        `;

        modalFiltro.innerHTML = `
            <div data-value="todos" style="padding: 10px 16px; cursor: pointer; font-size: 0.875rem; color: var(--text-1);">Todos</div>
            <div data-value="aguardando revisão" style="padding: 10px 16px; cursor: pointer; font-size: 0.875rem; color: var(--text-1);">Aguardando revisão</div>
            <div data-value="revisada" style="padding: 10px 16px; cursor: pointer; font-size: 0.875rem; color: var(--text-1);">Revisadas</div>
        `;

        const containerFiltro = btnFiltro.parentElement;
        if (containerFiltro) {
            containerFiltro.style.position = 'relative';
            containerFiltro.appendChild(modalFiltro);
        }
    }

    function aplicarFiltros() {
        const termo = inputBusca.value.toLowerCase().trim();

        cards.forEach(card => {
            const nome = (card.getAttribute('data-nome') || '').toLowerCase();
            const status = (card.getAttribute('data-status') || '').toLowerCase();

            const bateuNome = nome.includes(termo);
            const bateuStatus = (statusSelecionado === 'todos') || (status === statusSelecionado);

            if (bateuNome && bateuStatus) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    inputBusca.addEventListener('input', aplicarFiltros);

    if (btnFiltro) {
        btnFiltro.addEventListener('click', (e) => {
            e.stopPropagation();
            modalFiltro.style.display = modalFiltro.style.display === 'block' ? 'none' : 'block';
        });
    }

    modalFiltro.querySelectorAll('div[data-value]').forEach(opcao => {
        opcao.addEventListener('click', (e) => {
            statusSelecionado = e.target.getAttribute('data-value');
            modalFiltro.style.display = 'none';

            if (statusSelecionado !== 'todos') {
                btnFiltro.style.opacity = '1';
            } else {
                btnFiltro.style.opacity = '0.7';
            }

            aplicarFiltros();
        });
    });

    document.addEventListener('click', (e) => {
        if (modalFiltro && !modalFiltro.contains(e.target) && e.target !== btnFiltro) {
            modalFiltro.style.display = 'none';
        }
    });
});