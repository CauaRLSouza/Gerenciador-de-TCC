document.addEventListener("DOMContentLoaded", () => {
    const modalHTML = `
        <div id="ModalPublicarTCC" class="modal-overlay hidden">
            <div class="modal-card">
                <header class="modal-header">
                    <h2>Publicar TCC</h2>
                    <button id="BtnFecharModal" class="btn-fechar" type="button" aria-label="Fechar">&times;</button>
                </header>

                <form id="FormPublicarTCC" enctype="multipart/form-data">
                    <div class="campo-form">
                        <label for="TituloTCC">Título do TCC</label>
                        <input type="text" id="TituloTCC" name="titulo" placeholder="Digite o título do trabalho" required>
                    </div>

                    <div class="campo-form">
                        <label for="AutorTCC">Nome do Autor</label>
                        <input type="text" id="AutorTCC" name="autor" placeholder="Digite o nome do autor" required>
                    </div>

                    <div class="campo-form">
                        <label for="ArquivoTCC">Arquivo do TCC (PDF)</label>
                        <div class="upload-file-box">
                            <input type="file" id="ArquivoTCC" name="arquivo" accept=".pdf" required>
                            <span id="NomeArquivo">Selecionar arquivo em PDF</span>
                            <span class="icon-mask icon-upload"></span>
                        </div>
                    </div>

                    <div class="campo-form">
                        <label for="ResumoTCC">Resumo</label>
                        <textarea id="ResumoTCC" name="resumo" rows="4" placeholder="Escreva o resumo do TCC..." required></textarea>
                    </div>

                    <div class="modal-acoes">
                        <button type="button" id="BtnCancelarModal" class="btn-secundario">Cancelar</button>
                        <button type="submit" class="btn-primario">Publicar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const btnAbrirModal = document.getElementById("BtnPublicarTCC");
    const btnFecharModal = document.getElementById("BtnFecharModal");
    const btnCancelarModal = document.getElementById("BtnCancelarModal");
    const modal = document.getElementById("ModalPublicarTCC");
    const formPublicar = document.getElementById("FormPublicarTCC");
    const inputArquivo = document.getElementById("ArquivoTCC");
    const labelNomeArquivo = document.getElementById("NomeArquivo");

    const abrirModal = () => {
        if (modal) modal.classList.remove("hidden");
    };

    const fecharModal = () => {
        if (modal) {
            modal.classList.add("hidden");
            formPublicar.reset();
            labelNomeArquivo.textContent = "Selecionar arquivo em PDF";
        }
    };

    if (btnAbrirModal) btnAbrirModal.addEventListener("click", abrirModal);
    if (btnFecharModal) btnFecharModal.addEventListener("click", fecharModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener("click", fecharModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) fecharModal();
        });
    }

    if (inputArquivo) {
        inputArquivo.addEventListener("change", (e) => {
            const arquivo = e.target.files[0];
            if (arquivo) {
                labelNomeArquivo.textContent = arquivo.name;
            } else {
                labelNomeArquivo.textContent = "Selecionar arquivo em PDF";
            }
        });
    }

    if (formPublicar) {
        formPublicar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formPublicar);

            try {
                const response = await fetch("/acervo/publicar", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    fecharModal();
                    window.location.reload();
                } else {
                    alert("Erro ao publicar o TCC. Tente novamente.");
                }
            } catch (erro) {
                console.error("Erro na requisição:", erro);
            }
        });
    }
});