document.addEventListener("DOMContentLoaded", () => {
    const pathAtual = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll("#BottomNav .nav-btn");
    navLinks.forEach(link => {
        const href = link.getAttribute("href").toLowerCase();
        if (pathAtual === href || (pathAtual === "/" && href.includes("/dashboard"))) {
            link.classList.add("ativo", "active");
        }
    });

    const datasComReuniao = ["2026-08-05", "2026-08-28", "2026-09-11"];
    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    let dataAtual = new Date(2026, 7, 28);
    let diaSelecionado = "2026-08-28";

    const elTituloMes = document.getElementById("AgendaCalendarioTitulo");
    const elLinhaCalendario = document.getElementById("AgendaCalendarioLinha");
    const elEmptyState = document.getElementById("AgendaEmptyState");
    const cardsReuniao = document.querySelectorAll(".card-reuniao");

    function formatarDataISO(ano, mes, dia) {
        const m = String(mes + 1).padStart(2, '0');
        const d = String(dia).padStart(2, '0');
        return `${ano}-${m}-${d}`;
    }

    function renderizarCalendario() {
        const ano = dataAtual.getFullYear();
        const mes = dataAtual.getMonth();

        if (elTituloMes) elTituloMes.textContent = `${nomesMeses[mes]} ${ano}`;
        if (!elLinhaCalendario) return;
        elLinhaCalendario.innerHTML = "";

        let inicioSemana = new Date(dataAtual);
        let diaSemana = inicioSemana.getDay();
        let diff = inicioSemana.getDate() - diaSemana;
        inicioSemana.setDate(diff);

        for (let i = 0; i < 7; i++) {
            let d = new Date(inicioSemana);
            d.setDate(inicioSemana.getDate() + i);

            const isoDate = formatarDataISO(d.getFullYear(), d.getMonth(), d.getDate());
            const numDia = d.getDate();
            const diaSemanaNome = diasDaSemana[d.getDay()];

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "card-dia";
            btn.id = `AgendaDia${numDia}`;

            if (d.getMonth() !== mes) {
                btn.style.opacity = "0.4";
            }

            btn.innerHTML = `
                <span class="dia-semana-rotulo">${diaSemanaNome}</span>
                <span>${numDia}</span>
            `;

            if (isoDate === diaSelecionado) {
                btn.classList.add("dia-ativo");
            }

            if (datasComReuniao.includes(isoDate)) {
                btn.classList.add("dia-com-evento");
            }

            btn.addEventListener("click", () => {
                diaSelecionado = isoDate;
                dataAtual = new Date(d);
                renderizarCalendario();
                filtrarFeed();
            });

            elLinhaCalendario.appendChild(btn);
        }
    }

    function filtrarFeed() {
        let encontrou = false;
        cardsReuniao.forEach(card => {
            if (card.getAttribute("data-data") === diaSelecionado) {
                card.style.display = "flex";
                encontrou = true;
            } else {
                card.style.display = "none";
            }
        });

        if (elEmptyState) {
            elEmptyState.style.display = encontrou ? "none" : "block";
        }
    }

    const btnMesAnt = document.getElementById("BtnMesAnterior");
    if (btnMesAnt) {
        btnMesAnt.addEventListener("click", () => {
            dataAtual.setMonth(dataAtual.getMonth() - 1);
            dataAtual.setDate(1);
            diaSelecionado = formatarDataISO(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
            renderizarCalendario();
            filtrarFeed();
        });
    }

    const btnMesProx = document.getElementById("BtnMesProximo");
    if (btnMesProx) {
        btnMesProx.addEventListener("click", () => {
            dataAtual.setMonth(dataAtual.getMonth() + 1);
            dataAtual.setDate(1);
            diaSelecionado = formatarDataISO(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
            renderizarCalendario();
            filtrarFeed();
        });
    }

    const btnSemAnt = document.getElementById("BtnSemanaAnterior");
    if (btnSemAnt) {
        btnSemAnt.addEventListener("click", () => {
            dataAtual.setDate(dataAtual.getDate() - 7);
            diaSelecionado = formatarDataISO(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
            renderizarCalendario();
            filtrarFeed();
        });
    }

    const btnSemProx = document.getElementById("BtnSemanaProxima");
    if (btnSemProx) {
        btnSemProx.addEventListener("click", () => {
            dataAtual.setDate(dataAtual.getDate() + 7);
            diaSelecionado = formatarDataISO(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
            renderizarCalendario();
            filtrarFeed();
        });
    }

    renderizarCalendario();
    filtrarFeed();

    const btnNovaReuniao = document.getElementById('BtnNovaReuniao');
    const modalAgendar = document.getElementById('modalAgendarReuniao');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const btnCancelar = document.getElementById('btnCancelarAgendamento');

    const btnPresencial = document.getElementById('btnModalidadePresencial');
    const btnOnline = document.getElementById('btnModalidadeOnline');
    const inputModalidade = document.getElementById('inputModalidade');

    const campoPresencial = document.getElementById('campoPresencial');
    const campoOnline = document.getElementById('campoOnline');

    if (modalAgendar && btnNovaReuniao) {
        const abrirModal = () => modalAgendar.style.display = 'flex';
        const fecharModal = () => modalAgendar.style.display = 'none';

        btnNovaReuniao.addEventListener('click', abrirModal);
        if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
        if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

        modalAgendar.addEventListener('click', (e) => {
            if (e.target === modalAgendar) fecharModal();
        });

        if (btnPresencial && btnOnline) {
            btnPresencial.addEventListener('click', () => {
                btnPresencial.classList.add('active');
                btnOnline.classList.remove('active');
                inputModalidade.value = 'presencial';
                campoPresencial.style.display = 'block';
                campoOnline.style.display = 'none';
            });

            btnOnline.addEventListener('click', () => {
                btnOnline.classList.add('active');
                btnPresencial.classList.remove('active');
                inputModalidade.value = 'online';
                campoPresencial.style.display = 'none';
                campoOnline.style.display = 'block';
            });
        }
    }
});