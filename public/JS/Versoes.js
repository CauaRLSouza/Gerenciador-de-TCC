document.addEventListener("DOMContentLoaded", () => {
            const selectOrdenacao = document.getElementById("SelectOrdenacao");
            const containerLista = document.getElementById("ListaVersoes");

            if (!selectOrdenacao || !containerLista) return;

            const ordenacaoSalva = localStorage.getItem("ordenacao_versoes");
            if (ordenacaoSalva) {
                selectOrdenacao.value = ordenacaoSalva;
            }

            function parseData(textoData) {
                const match = textoData.match(/(\d{2})\/(\d{2})\/(\d{4})\s*•\s*(\d{2}):(\d{2})/);
                if (!match) return 0;
                const [, dia, mes, ano, hora, minuto] = match;
                return new Date(ano, mes - 1, dia, hora, minuto).getTime();
            }

            function ordenarCards() {
                const opcao = selectOrdenacao.value;
                localStorage.setItem("ordenacao_versoes", opcao);

                const cards = Array.from(containerLista.querySelectorAll(".card-versao"));

                cards.sort((a, b) => {
                    const tituloA = a.querySelector(".versao-titulo")?.textContent.trim() || "";
                    const tituloB = b.querySelector(".versao-titulo")?.textContent.trim() || "";
                    
                    const dataTextoA = a.querySelector(".card-versao-data time")?.textContent.trim() || "";
                    const dataTextoB = b.querySelector(".card-versao-data time")?.textContent.trim() || "";
                    
                    const timestampA = parseData(dataTextoA);
                    const timestampB = parseData(dataTextoB);

                    if (opcao === "recentes") {
                        return timestampB - timestampA;
                    } else if (opcao === "antigas") {
                        return timestampA - timestampB;
                    } else if (opcao === "alfabetica") {
                        return tituloA.localeCompare(tituloB, "pt-BR", { numeric: true, sensitivity: "base" });
                    }
                    return 0;
                });

                cards.forEach(card => containerLista.appendChild(card));
            }

            selectOrdenacao.addEventListener("change", ordenarCards);
            ordenarCards();
        });