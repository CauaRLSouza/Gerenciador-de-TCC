document.addEventListener("DOMContentLoaded", () => {
    const btnAbrir = document.querySelector(".btn-adicionar-comentario, button:has(.icon-plus), .status-atual + button, [class*='Adicionar']");
    const modal = document.getElementById("modalComentario");
    const btnFechar = document.getElementById("btnFecharModalComentario");
    const btnCancelar = document.getElementById("btnCancelarComentario");

    const abrirModal = () => {
        if (modal) modal.style.display = "flex";
    };

    const fecharModal = () => {
        if (modal) modal.style.display = "none";
    };

    const botoesAdicionar = document.querySelectorAll("button");
    botoesAdicionar.forEach(btn => {
        if (btn.textContent.includes("Adicionar comentário")) {
            btn.addEventListener("click", abrirModal);
        }
    });

    if (btnFechar) btnFechar.addEventListener("click", fecharModal);
    if (btnCancelar) btnCancelar.addEventListener("click", fecharModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) fecharModal();
        });
    }
});