# Controle Financeiro

Aplicação Next.js para gestão de gastos pessoais e familiares.

## Como rodar

```bash
cd controle-app
npm install
npm run dev
```

Acesse em `http://localhost:3000`.

## Estrutura

```
controle-app/
├── app/           # Rota principal (page.tsx + layout.tsx)
├── components/    # Componentes React
├── hooks/         # useFinance – estado global
└── lib/
    ├── types.ts   # Tipos e interfaces
    ├── utils.ts   # Funções utilitárias e constantes
    └── storage.ts # Persistência no localStorage
```

## Constantes de automação

As constantes abaixo controlam as opções disponíveis na interface. Para adicionar um novo valor, basta incluir no array correspondente.

### Categorias (`lib/utils.ts` → `TransactionForm.tsx`)

```ts
const CATEGORIAS: Categoria[] = [
  'Alimentação', 'Moradia', 'Transporte', 'Lazer',
  'Streaming', 'Saúde', 'Salário', 'Educação', 'Vestuário', 'Outros',
]
```

### Formas de pagamento (`TransactionForm.tsx`)

```ts
const PAGAMENTOS: FormaPagamento[] = [
  'Cartão', 'Pix', 'Dinheiro', 'Boleto', 'Transferência',
]
```

### Cores dos membros da família (`lib/utils.ts`)

```ts
export const CORES_MEMBROS = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea',
  '#ea580c', '#0891b2', '#65a30d', '#db2777',
]
```

### Cores dos gráficos (`lib/utils.ts`)

```ts
export const CORES_GRAFICO = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea',
  '#ea580c', '#0891b2', '#65a30d', '#db2777',
  '#f59e0b', '#6366f1',
]
```

### Cores por categoria (`TransactionList.tsx`)

```ts
const CATEGORIA_CORES: Record<string, string> = {
  Alimentação: '#f97316',
  Moradia:     '#6366f1',
  Transporte:  '#0ea5e9',
  Lazer:       '#a855f7',
  Streaming:   '#ec4899',
  Saúde:       '#10b981',
  Salário:     '#16a34a',
  Educação:    '#f59e0b',
  Vestuário:   '#8b5cf6',
  Outros:      '#9ca3af',
}
```

### Chave do localStorage (`lib/storage.ts`)

```ts
const STORAGE_KEY = 'controle-financeiro-v3'
```

> Ao mudar a versão da chave, o código migra automaticamente os dados da versão anterior (`v2 → v3`), preservando todas as transações com `scope: 'pessoal'` por padrão.

## Escopos

Cada transação pertence a um escopo:

| Escopo     | Descrição                              |
|------------|----------------------------------------|
| `pessoal`  | Finanças individuais do usuário        |
| `familia`  | Gastos compartilhados da família       |

A aba **Pessoal** mostra apenas transações pessoais. A aba **Família** mostra transações familiares e permite gerenciar membros e dividir contas.

## Exportação

Os botões **Excel** e **PDF** no cabeçalho exportam as transações do período selecionado. As bibliotecas usadas são carregadas sob demanda:

- Excel: [`xlsx`](https://www.npmjs.com/package/xlsx)
- PDF: [`jspdf`](https://www.npmjs.com/package/jspdf) + [`jspdf-autotable`](https://www.npmjs.com/package/jspdf-autotable)
