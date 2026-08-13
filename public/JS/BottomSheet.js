document.addEventListener("DOMContentLoaded", () => {
    const BottomSheet = (function () {
        const bottomSheetHtml = `
            <div id="MenuMaisOverlay" class="menu-overlay hidden">
                <div class="menu-sheet">
                    <div class="sheet-drag-handle"></div>
                    <h3 class="sheet-titulo">Mais</h3>
                    <div class="sheet-opcoes">
                        <a href="/bancas" class="opcao-item">
                            <div class="opcao-icone roxo">
                                <span class="icon-mask icon-calendar"></span>
                            </div>
                            <div class="opcao-conteudo">
                                <strong>Bancas</strong>
                                <p>Visualize o calendário de bancas, atas e agendamentos.</p>
                            </div>
                            <span class="icon-mask icon-seta-direita"></span>
                        </a>
                        <a href="/tcc" class="opcao-item">
                            <div class="opcao-icone azul">
                                <span class="icon-mask icon-files"></span>
                            </div>
                            <div class="opcao-conteudo">
                                <strong>TCCs Submetidos</strong>
                                <p>Lista de trabalhos em análise e aprovação antes de irem ao acervo.</p>
                            </div>
                            <span class="icon-mask icon-seta-direita"></span>
                        </a>
                        <a href="/perfil" class="opcao-item">
                            <div class="opcao-icone cinza">
                                <span class="icon-mask icon-perfil"></span>
                            </div>
                            <div class="opcao-conteudo">
                                <strong>Perfil</strong>
                                <p>Preferências da conta, assinatura e dados do operador.</p>
                            </div>
                            <span class="icon-mask icon-seta-direita"></span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bottomSheetHtml);

        const btnAbrirMais = document.getElementById('btnAbrirMais');
        const menuOverlay = document.getElementById('MenuMaisOverlay');

        if (btnAbrirMais && menuOverlay) {
            btnAbrirMais.addEventListener('click', (e) => {
                e.preventDefault();
                menuOverlay.classList.remove('hidden');
            });

            menuOverlay.addEventListener('click', (e) => {
                if (e.target === menuOverlay) {
                    menuOverlay.classList.add('hidden');
                }
            });
        }
    })();
});