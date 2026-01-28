import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  StatusGeralData,
  MetasReportData,
  ExecucaoFinanceiraData,
} from "../types/report";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatDate = (date: Date | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("pt-BR");
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const pdfService = {
  gerarPDFStatusGeral(data: StatusGeralData): void {
    const doc = new jsPDF();
    let yPos = 20;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Status Geral", 105, yPos, { align: "center" });
    yPos += 15;

    // Informações do Projeto
    doc.setFontSize(14);
    doc.text("Informações do Projeto", 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const infoTexts = [
      `Projeto: ${data.nomeProjeito}`,
      `Linha: ${data.linha}`,
      `Status: ${data.statusGeral}`,
      `Período: ${formatDate(data.periodo.inicio)} a ${formatDate(data.periodo.fim)}`,
      "",
      "Dados Financeiros:",
      `Valor Aprovado: ${formatCurrency(data.valorAprovado)}`,
      `Valor Captado: ${formatCurrency(data.valorCaptado)} (${formatPercentage(data.percentualCaptado)})`,
      `Valor Executado: ${formatCurrency(data.valorExecutado)} (${formatPercentage(data.percentualExecutado)})`,
    ];

    infoTexts.forEach((text) => {
      doc.text(text, 20, yPos);
      yPos += 6;
    });

    yPos += 5;

    // Resumo de Metas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo de Metas", 20, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [["Indicador", "Quantidade"]],
      body: [
        ["Total de Metas", data.totalMetas.toString()],
        ["Metas Concluídas", data.metasConcluidas.toString()],
        ["Metas Pendentes", data.metasPendentes.toString()],
        ["Metas Atrasadas", data.metasAtrasadas.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [100, 108, 255] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Resumo Financeiro
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo de Rubricas", 20, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [["Status", "Quantidade"]],
      body: [
        ["Total de Rubricas", data.rubricasTotal.toString()],
        ["Dentro do Limite", data.rubricasDentroLimite.toString()],
        ["Próximo do Limite", data.rubricasProximoLimite.toString()],
        ["Acima do Limite", data.rubricasAcimaLimite.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [100, 108, 255] },
    });

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
        20,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`Relatorio_Status_Geral_${Date.now()}.pdf`);
  },

  gerarPDFMetas(data: MetasReportData): void {
    const doc = new jsPDF();
    let yPos = 20;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Metas", 105, yPos, { align: "center" });
    yPos += 15;

    // Resumo
    doc.setFontSize(14);
    doc.text("Resumo Geral", 20, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [["Indicador", "Quantidade"]],
      body: [
        ["Total de Metas", data.total.toString()],
        ["Concluídas", data.concluidas.toString()],
        ["Pendentes", data.pendentes.toString()],
        ["Atrasadas", data.atrasadas.toString()],
        ["Canceladas", data.canceladas.toString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [100, 108, 255] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Detalhamento das Metas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhamento das Metas", 20, yPos);
    yPos += 10;

    const metasBody = data.metas.map((meta) => [
      meta.nome,
      formatDate(meta.dataLimite),
      meta.responsavel,
      meta.status,
      meta.sinaleira.toUpperCase(),
      meta.documentosCount.toString(),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [
        ["Meta", "Data Limite", "Responsável", "Status", "Sinaleira", "Docs"],
      ],
      body: metasBody,
      theme: "striped",
      headStyles: { fillColor: [100, 108, 255] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
      },
      styles: { fontSize: 8 },
      didParseCell: function (data) {
        if (data.column.index === 4 && data.section === "body") {
          const sinaleira = data.cell.raw as string;
          if (sinaleira === "VERDE") {
            data.cell.styles.textColor = [34, 197, 94];
          } else if (sinaleira === "AMARELO") {
            data.cell.styles.textColor = [245, 158, 11];
          } else if (sinaleira === "VERMELHO") {
            data.cell.styles.textColor = [239, 68, 68];
          } else if (sinaleira === "AZUL") {
            data.cell.styles.textColor = [59, 130, 246];
          }
        }
      },
    });

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
        20,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`Relatorio_Metas_${Date.now()}.pdf`);
  },

  gerarPDFExecucaoFinanceira(
    data: ExecucaoFinanceiraData,
    detalhado: boolean = false
  ): void {
    const doc = new jsPDF();
    let yPos = 20;

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Relatório de Execução Financeira ${detalhado ? "- Detalhado" : "- Resumido"}`,
      105,
      yPos,
      { align: "center" }
    );
    yPos += 15;

    // Resumo Geral
    doc.setFontSize(14);
    doc.text("Resumo Geral", 20, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [["Indicador", "Valor"]],
      body: [
        [
          "Valor Total Aprovado",
          formatCurrency(data.valorTotalAprovado),
        ],
        [
          "Valor Total Executado",
          formatCurrency(data.valorTotalExecutado),
        ],
        [
          "Percentual Executado",
          formatPercentage(data.percentualExecutado),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [100, 108, 255] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Rubricas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhamento por Rubrica", 20, yPos);
    yPos += 10;

    const rubricasBody = data.rubricas.map((rubrica) => [
      rubrica.nome,
      formatCurrency(rubrica.valorPrevisto),
      formatCurrency(rubrica.valorExecutado),
      formatPercentage(rubrica.percentualExecutado),
      rubrica.status,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [
        ["Rubrica", "Valor Previsto", "Valor Executado", "% Executado", "Status"],
      ],
      body: rubricasBody,
      theme: "striped",
      headStyles: { fillColor: [100, 108, 255] },
      styles: { fontSize: 9 },
    });

    // Se detalhado, adicionar itens de cada rubrica
    if (detalhado) {
      data.rubricas.forEach((rubrica) => {
        if (rubrica.itens && rubrica.itens.length > 0) {
          doc.addPage();
          yPos = 20;

          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`Itens da Rubrica: ${rubrica.nome}`, 20, yPos);
          yPos += 10;

          const itensBody = rubrica.itens.map((item) => [
            item.nome,
            item.fornecedor,
            formatCurrency(item.valorPrevisto),
            formatCurrency(item.valorExecutado),
            item.numeroNF || "N/A",
            item.dataDespesa ? formatDate(item.dataDespesa) : "N/A",
          ]);

          autoTable(doc, {
            startY: yPos,
            head: [
              [
                "Item",
                "Fornecedor",
                "Previsto",
                "Executado",
                "NF",
                "Data",
              ],
            ],
            body: itensBody,
            theme: "grid",
            headStyles: { fillColor: [139, 92, 246] },
            styles: { fontSize: 8 },
            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: 35 },
              2: { cellWidth: 25 },
              3: { cellWidth: 25 },
              4: { cellWidth: 25 },
              5: { cellWidth: 20 },
            },
          });
        }
      });
    }

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
        20,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(
      `Relatorio_Execucao_Financeira_${detalhado ? "Detalhado" : "Resumido"}_${Date.now()}.pdf`
    );
  },
};