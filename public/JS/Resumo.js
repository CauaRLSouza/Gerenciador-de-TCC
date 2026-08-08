const PERIODO_ATUAL = '2026.1';

const dadosPorPeriodo = {
    '2026.1': { tccsAndamento: 26, aptosBanca: 8, bancasAgendadas: 3, concluidos: 15, alunos: 26, professores: 11, tccs: 26, bancas: 3, pBanca: 5, pTermos: 3, pRevisao: 7 },
    '2025.2': { tccsAndamento: 22, aptosBanca: 22, bancasAgendadas: 20, concluidos: 2, alunos: 22, professores: 12, tccs: 22, bancas: 22, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2025.1': { tccsAndamento: 19, aptosBanca: 19, bancasAgendadas: 18, concluidos: 1, alunos: 19, professores: 9, tccs: 19, bancas: 19, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2024.2': { tccsAndamento: 17, aptosBanca: 17, bancasAgendadas: 16, concluidos: 1, alunos: 17, professores: 11, tccs: 17, bancas: 17, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2024.1': { tccsAndamento: 15, aptosBanca: 15, bancasAgendadas: 15, concluidos: 0, alunos: 15, professores: 10, tccs: 15, bancas: 15, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2023.2': { tccsAndamento: 14, aptosBanca: 14, bancasAgendadas: 13, concluidos: 1, alunos: 14, professores: 8, tccs: 14, bancas: 14, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2023.1': { tccsAndamento: 12, aptosBanca: 12, bancasAgendadas: 12, concluidos: 0, alunos: 12, professores: 10, tccs: 12, bancas: 12, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2022.2': { tccsAndamento: 10, aptosBanca: 10, bancasAgendadas: 9, concluidos: 1, alunos: 10, professores: 9, tccs: 10, bancas: 10, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2022.1': { tccsAndamento: 8, aptosBanca: 8, bancasAgendadas: 8, concluidos: 0, alunos: 8, professores: 11, tccs: 8, bancas: 8, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2021.2': { tccsAndamento: 6, aptosBanca: 6, bancasAgendadas: 6, concluidos: 0, alunos: 6, professores: 8, tccs: 6, bancas: 6, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2021.1': { tccsAndamento: 5, aptosBanca: 5, bancasAgendadas: 5, concluidos: 0, alunos: 5, professores: 9, tccs: 5, bancas: 5, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2020.2': { tccsAndamento: 4, aptosBanca: 4, bancasAgendadas: 4, concluidos: 0, alunos: 4, professores: 7, tccs: 4, bancas: 4, pBanca: 0, pTermos: 0, pRevisao: 0 },
    '2020.1': { tccsAndamento: 3, aptosBanca: 3, bancasAgendadas: 3, concluidos: 0, alunos: 3, professores: 8, tccs: 3, bancas: 3, pBanca: 0, pTermos: 0, pRevisao: 0 }
};

function atualizarPeriodo(periodo) {
    const dados = dadosPorPeriodo[periodo] || dadosPorPeriodo[PERIODO_ATUAL];

    document.getElementById('valTccsAndamento').innerText = dados.tccsAndamento;
    document.getElementById('valAptosBanca').innerText = dados.aptosBanca;
    document.getElementById('valBancasAgendadas').innerText = dados.bancasAgendadas;
    document.getElementById('valConcluidos').innerText = dados.concluidos;

    document.getElementById('valAtalhoAlunos').innerText = dados.alunos;
    document.getElementById('valAtalhoProfessores').innerText = dados.professores;
    document.getElementById('valAtalhoTccs').innerText = dados.tccs;
    document.getElementById('valAtalhoBancas').innerText = dados.bancas;

    document.getElementById('valPendenciaBanca').innerText = dados.pBanca;
    document.getElementById('valPendenciaTermos').innerText = dados.pTermos;
    document.getElementById('valPendenciaRevisao').innerText = dados.pRevisao;

    const lblTccs = document.getElementById('lblTccs');
    const lblAptos = document.getElementById('lblAptos');
    const lblBancas = document.getElementById('lblBancas');
    const lblConcluidos = document.getElementById('lblConcluidos');

    const badgeStatus = document.getElementById('badgeStatusPeriodo');

    if (periodo !== PERIODO_ATUAL) {
        if (lblTccs) lblTccs.innerText = 'TCCs defendidos';
        if (lblAptos) lblAptos.innerText = 'Bancas realizadas';
        if (lblBancas) lblBancas.innerText = 'Aprovados';
        if (lblConcluidos) lblConcluidos.innerText = 'Reprovados';

        if (badgeStatus) {
            badgeStatus.classList.remove('oculto');
        }
    } else {
        if (lblTccs) lblTccs.innerText = 'TCCs em andamento';
        if (lblAptos) lblAptos.innerText = 'Aptos para banca';
        if (lblBancas) lblBancas.innerText = 'Bancas agendadas';
        if (lblConcluidos) lblConcluidos.innerText = 'Concluídos';

        if (badgeStatus) {
            badgeStatus.classList.add('oculto');
        }
    }
}

function verRelatorioCompleto() {
    const periodoSelect = document.getElementById('periodoLetivo');
    const periodo = periodoSelect ? periodoSelect.value : PERIODO_ATUAL;
    alert('Abrindo relatório completo do período: ' + periodo);
}