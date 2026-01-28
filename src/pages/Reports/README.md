# 📊 Módulo de Relatórios Automáticos

## Visão Geral

O módulo de Relatórios Automáticos permite gerar relatórios completos e detalhados sobre os projetos, incluindo status geral, metas físicas e execução financeira. Os relatórios podem ser visualizados diretamente na tela ou exportados em formato PDF.

## Funcionalidades Implementadas

### ✅ 1. Status Geral
Relatório completo com visão geral do projeto incluindo:
- Informações básicas do projeto (nome, linha, status, período)
- Resumo financeiro (aprovado, captado, executado)
- Resumo de metas (total, concluídas, pendentes, atrasadas)
- Situação das rubricas (dentro, próximo e acima do limite)

### ✅ 2. Metas Físicas
Relatório detalhado sobre as metas do projeto:
- Resumo geral (total, concluídas, pendentes, atrasadas, canceladas)
- Tabela detalhada com todas as metas
- Sistema de sinaleira (verde, amarelo, vermelho, azul)
- Status de cada meta
- Quantidade de documentos anexados

### ✅ 3. Execução Financeira
Relatório financeiro com dois níveis de detalhe:

**Modo Resumido:**
- Resumo geral (valor aprovado, executado, percentual)
- Visão por rubrica com valores e percentuais
- Status de cada rubrica
- Barra de progresso visual

**Modo Detalhado:**
- Tudo do modo resumido +
- Listagem completa de itens por rubrica
- Informações de fornecedores
- Números de notas fiscais
- Datas de despesas

### 🚧 4. Funcionalidades Futuras
As seguintes funcionalidades estão marcadas como "Em breve":
- Contrapartidas
- Ações de Mídia
- Documentos Liberados

## Como Usar

### Acessando a Página de Relatórios
1. Faça login no sistema
2. No menu lateral, clique em "Relatórios"
3. A página de relatórios será aberta

### Gerando um Relatório

1. **Selecione o Projeto**: Escolha o projeto para o qual deseja gerar o relatório

2. **Escolha o Tipo de Relatório**:
   - Status Geral
   - Metas Físicas
   - Execução Financeira

3. **Selecione o Formato**:
   - **Visualização na Tela**: Exibe o relatório diretamente na interface
   - **Download PDF**: Gera e baixa automaticamente o relatório em PDF

4. **Nível de Detalhe** (apenas para Execução Financeira):
   - **Resumido**: Visão consolidada por rubrica
   - **Detalhado**: Inclui todos os itens de cada rubrica

5. **Clique em "Visualizar Relatório"** ou **"Gerar e Baixar PDF"**

### Exportando um Relatório Visualizado

Se você optou por visualizar o relatório na tela, você pode:
1. Revisar os dados exibidos
2. Clicar em "Exportar como PDF" para baixar o PDF
3. Ou clicar em "Limpar Visualização" para gerar um novo relatório

## Estrutura de Arquivos

```
src/pages/Reports/
├── Reports.tsx                 # Componente principal da página
├── Reports.css                 # Estilos da página e componentes
├── README.md                   # Esta documentação
├── index.ts                    # Exportações do módulo
└── components/
    ├── StatusGeralReport.tsx   # Visualização do relatório de status geral
    ├── MetasReport.tsx         # Visualização do relatório de metas
    └── FinanceiroReport.tsx    # Visualização do relatório financeiro

src/services/
├── relatorioService.ts         # Lógica de geração de dados dos relatórios
└── pdfService.ts              # Geração de PDFs usando jsPDF

src/types/
└── report.ts                  # Tipos TypeScript para relatórios
```

## Tecnologias Utilizadas

- **jsPDF**: Geração de documentos PDF
- **jspdf-autotable**: Criação de tabelas formatadas em PDF
- **React**: Interface de usuário
- **TypeScript**: Tipagem forte
- **Lucide React**: Ícones

## Formatação e Estilos

### Visualização na Tela
- Design responsivo e moderno
- Cards coloridos para resumos
- Tabelas formatadas
- Badges de status e sinaleiras
- Barras de progresso visuais
- Indicadores visuais de cores para status

### PDF
- Cabeçalho com título do relatório
- Informações organizadas em tabelas
- Formatação de moeda em Real (R$)
- Formatação de datas em pt-BR
- Rodapé com data de geração e paginação
- Cores nas tabelas para melhor legibilidade

## Formatações de Dados

### Moeda
```typescript
R$ 1.234.567,89
```

### Data
```typescript
28/01/2026
```

### Percentual
```typescript
75.50%
```

## Sistema de Cores

### Sinaleira de Metas
- 🟢 **Verde**: Meta dentro do prazo (mais de 7 dias)
- 🟡 **Amarelo**: Meta próxima do prazo (7 dias ou menos)
- 🔴 **Vermelho**: Meta atrasada ou cancelada
- 🔵 **Azul**: Meta concluída

### Status de Rubricas
- 🟢 **Verde**: Dentro do limite
- 🟡 **Laranja**: Próximo do limite (90%+)
- 🔴 **Vermelho**: Acima do limite

## Observações Técnicas

1. **Performance**: Os relatórios são gerados de forma assíncrona para não bloquear a interface
2. **Cache**: Não há cache dos dados, sempre busca informações atualizadas
3. **Responsividade**: Todos os componentes são responsivos para mobile
4. **Acessibilidade**: Labels e estruturas semânticas para melhor acessibilidade
5. **Tratamento de Erros**: Mensagens claras em caso de falha

## Próximos Passos

- [ ] Implementar relatório de Contrapartidas
- [ ] Implementar relatório de Ações de Mídia
- [ ] Implementar relatório de Documentos Liberados
- [ ] Adicionar gráficos com Recharts
- [ ] Implementar filtros por data
- [ ] Adicionar opção de envio por email
- [ ] Implementar agendamento de relatórios
- [ ] Adicionar exportação para Excel
