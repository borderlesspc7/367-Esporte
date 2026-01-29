# 📊 Dashboard Principal

## Visão Geral

O Dashboard Principal é a tela inicial do sistema após o login, apresentando uma visão consolidada de todos os projetos e seus indicadores chave. É a central de comando para acompanhamento geral do portfólio de projetos.

## Funcionalidades Implementadas

### ✅ 1. Cards de Estatísticas Gerais

Quatro cards principais com métricas consolidadas:

#### **Total de Projetos**

- Quantidade total de projetos cadastrados
- Quantos estão em execução
- Ícone: FolderKanban
- Cor: Roxo (Primary)

#### **Projetos Concluídos**

- Número de projetos finalizados
- Percentual do total
- Ícone: CheckCircle2
- Cor: Verde (Success)

#### **Valor Captado**

- Soma total de valores captados de todos os projetos
- Mostra o valor aprovado total como referência
- Ícone: DollarSign
- Cor: Laranja (Warning)

#### **Valor Executado**

- Soma total de valores executados em todos os projetos
- Percentual do valor captado
- Ícone: TrendingUp
- Cor: Azul (Info)

### ✅ 2. Todos os Projetos

Lista completa de projetos com métricas de execução:

**Para cada projeto são exibidos:**

- Nome do projeto
- Status atual (badge colorido)
- **Execução Física:**
  - Percentual de metas concluídas
  - Barra de progresso verde
  - Contagem: X de Y metas
- **Execução Financeira:**
  - Percentual de execução orçamentária
  - Barra de progresso laranja
  - Valores: executado / captado

**Interatividade:**

- Cards clicáveis que navegam para a página de metas do projeto
- Hover com efeito de elevação
- Grid responsivo

### ✅ 3. Próximas Metas

Widget que exibe as 5 metas mais próximas (dentro de 30 dias):

**Informações por meta:**

- **Sinaleira visual** (verde/amarelo/vermelho/azul)
- Nome da meta
- Nome do projeto associado
- **Dias restantes:**
  - "Hoje" - se vence hoje
  - "Amanhã" - se vence amanhã
  - "X dias" - demais casos
- Data limite formatada

**Regras de exibição:**

- Exclui metas concluídas e canceladas
- Considera apenas metas com prazo nos próximos 30 dias
- Ordenadas por proximidade (mais urgente primeiro)
- Máximo de 5 metas

**Sistema de Sinaleira:**

- 🟢 **Verde**: Mais de 7 dias até o prazo
- 🟡 **Amarelo**: 7 dias ou menos até o prazo
- 🔴 **Vermelho**: Meta atrasada
- 🔵 **Azul**: Meta concluída (não aparece nesta lista)

### ✅ 4. Últimos Documentos

Widget que mostra os 5 documentos mais recentes:

**Informações por documento:**

- Ícone de arquivo
- Nome do documento
- Projeto associado
- Tipo/categoria do documento
- Data de envio

**Características:**

- Ordenados por data (mais recente primeiro)
- Layout compacto e escaneável
- Máximo de 5 documentos
- Nome truncado com ellipsis se muito longo

### ✅ 5. Sinaleiras Gerais

Sistema visual de sinaleiras implementado em:

- **Próximas Metas**: Badges circulares coloridos com ícones
- **Status dos Projetos**: Badges com gradientes
- **Indicadores de progresso**: Barras coloridas

## Cálculos e Métricas

### Execução Física

```typescript
percentualFisico = (metasConcluidas / totalMetas) × 100
```

### Execução Financeira

```typescript
percentualFinanceiro = (valorExecutado / valorCaptado) × 100
```

### Dias Restantes

```typescript
diasRestantes = Math.ceil((dataLimite - hoje) / (1000 × 60 × 60 × 24))
```

## Design e Estilo

### Paleta de Cores

**Cards de Estatísticas:**

- **Primary (Roxo)**: `#4338ca` → `#3730a3`
- **Success (Verde)**: `#10b981` → `#059669`
- **Warning (Laranja)**: `#f59e0b` → `#d97706`
- **Info (Azul)**: `#3b82f6` → `#2563eb`

**Fundos:**

- Container principal: `#1e293b` → `#334155`
- Cards internos: `#0f172a`
- Header de seções: `#334155` → `#1e293b`

**Status dos Projetos:**

- Em Planejamento: Laranja
- Em Execução: Azul
- Concluído: Verde
- Cancelado: Vermelho
- Pausado: Cinza

### Componentes Visuais

**Cards com:**

- Gradientes sutis
- Box-shadows com profundidade
- Bordas coloridas (#475569)
- Hover effects
- Transições suaves

**Barras de Progresso:**

- Altura: 6-8px
- Fundo dark com inset shadow
- Preenchimento com gradiente
- Animação suave (0.5s ease)

**Badges:**

- Border-radius: 6-8px
- Gradientes coloridos
- Box-shadow
- Uppercase com letter-spacing

## Layout Responsivo

### Desktop (> 1024px)

- 4 cards de estatísticas em linha
- Grid 2 colunas para widgets
- Lista de projetos em 2-3 colunas

### Tablet (768px - 1024px)

- 2 cards de estatísticas por linha
- Grid 1 coluna para widgets
- Lista de projetos em 1 coluna

### Mobile (< 768px)

- 1 card de estatística por linha
- Todos os widgets em coluna única
- Ajuste de espaçamentos

## Carregamento de Dados

### Estratégia de Load

1. **Carregamento Inicial:**
   - Busca todos os projetos
   - Para cada projeto, carrega:
     - Metas (para cálculo físico)
     - Relatórios financeiros (para cálculo financeiro)

2. **Agregação de Dados:**
   - Calcula estatísticas gerais
   - Filtra e ordena próximas metas
   - Coleta documentos recentes

3. **Estado de Loading:**
   - Spinner animado centralizado
   - Mensagem "Carregando dashboard..."

4. **Tratamento de Erros:**
   - Banner vermelho com mensagem de erro
   - Continua exibindo dados parciais quando possível

## Performance

### Otimizações Implementadas

- **Carregamento paralelo** de dados de projetos usando `Promise.all`
- **Try-catch individual** por projeto para não quebrar o dashboard todo
- **Filtragem local** de metas sem requisições extras
- **Limite de itens** (5) nos widgets de metas e documentos
- **Cálculos em memória** para estatísticas

### Tempo de Carregamento Esperado

- **Com 1-5 projetos**: < 2 segundos
- **Com 10-20 projetos**: 2-5 segundos
- **Com 50+ projetos**: 5-10 segundos

## Navegação

### Links Interativos

**Cards de Projetos:**

- Clique navega para: `/projects/:projectId/goals`
- Cursor pointer
- Visual feedback no hover

**Futuras Melhorias:**

- Permitir navegação para outras seções do projeto
- Adicionar ação rápida nos documentos
- Link direto para meta específica

## Estados da Interface

### Loading State

```
┌────────────────────────┐
│    ⟳ Spinner animado   │
│                        │
│ Carregando dashboard...│
└────────────────────────┘
```

### Error State

```
┌────────────────────────┐
│ ⚠ Erro ao carregar...  │
└────────────────────────┘
```

### Empty State (por widget)

```
┌────────────────────────┐
│  Nenhum item disponível│
└────────────────────────┘
```

### Success State

```
┌─ Stats ─────┬─ Stats ─┐
│  Cards com  │  Cards   │
│  métricas   │  4x      │
└─────────────┴──────────┘
┌─ Projetos ────────────┐
│  Lista de projetos    │
│  com métricas         │
└───────────────────────┘
┌─ Metas ──┬─ Docs ─────┐
│ Próximas │ Últimos    │
│ metas    │ documentos │
└──────────┴────────────┘
```

## Integrações

### Serviços Utilizados

- **projectService**: Lista todos os projetos
- **goalService**: Busca metas por projeto
- **relatorioService**: Gera relatórios de execução financeira

### Tipos Utilizados

- **Project**: Informações do projeto
- **Goal**: Dados das metas
- **ProjetoComMetricas**: Projeto + métricas calculadas
- **MetaProxima**: Meta + informações de proximidade
- **DashboardStats**: Estatísticas agregadas

## Melhorias Futuras

### Funcionalidades

- [ ] Filtro por período de tempo
- [ ] Filtro por status de projeto
- [ ] Exportação de relatório do dashboard
- [ ] Gráficos interativos (pizza, barras, linhas)
- [ ] Notificações de metas próximas
- [ ] Favoritar projetos
- [ ] Busca rápida de projetos
- [ ] Atalhos para ações rápidas

### Performance

- [ ] Cache de dados do dashboard
- [ ] Paginação na lista de projetos
- [ ] Lazy loading de widgets
- [ ] Refresh parcial (por widget)
- [ ] Web Workers para cálculos pesados

### UX

- [ ] Tooltips explicativos
- [ ] Skeleton loading
- [ ] Animações de transição
- [ ] Arrastar para reordenar widgets
- [ ] Customização de widgets exibidos

## Observações Técnicas

- Dashboard carrega todos os projetos e suas métricas na montagem inicial
- Não há refresh automático - usuário precisa recarregar a página
- Documentos são buscados dos anexos de metas (pode ser expandido)
- Sistema de sinaleira é calculado no cliente baseado em datas
- Todas as datas seguem o fuso horário do navegador
