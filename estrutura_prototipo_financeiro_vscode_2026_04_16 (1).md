# Estrutura de Arquivos do Projeto

```text
controle-financeiro/
│
├── README.md
├── index.html
├── style.css
└── script.js
```

---

# README.md

```md
# Controle Financeiro Pessoal e Familiar

Sistema simples para controle financeiro pessoal e familiar.

## Funcionalidades iniciais

- Cadastro de receitas
- Cadastro de despesas
- Separação por categoria
- Separação por forma de pagamento
- Resumo financeiro
- Listagem das movimentações

## Estrutura

- HTML: estrutura da aplicação
- CSS: layout e responsividade
- JavaScript: lógica do sistema

## Como rodar

1. Abra a pasta do projeto no VS Code
2. Abra o arquivo index.html
3. Clique com o botão direito e use "Open with Live Server"

## Próximas melhorias

- Salvar no localStorage
- Cadastro de membros da família
- Divisão automática das contas
- Dashboard com gráficos
- Filtros por período
- Exportação para Excel e PDF
```

---

# index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Controle Financeiro</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="container">
    <header>
      <h1>Controle Financeiro</h1>
      <p>Gestão de gastos pessoais e familiares</p>
    </header>

    <section class="resumo">
      <div class="card receita">
        <h2>Receitas</h2>
        <p id="totalReceitas">R$ 0,00</p>
      </div>

      <div class="card despesa">
        <h2>Despesas</h2>
        <p id="totalDespesas">R$ 0,00</p>
      </div>

      <div class="card saldo">
        <h2>Saldo</h2>
        <p id="saldoFinal">R$ 0,00</p>
      </div>
    </section>

    <section class="formulario">
      <h2>Nova Movimentação</h2>

      <form id="formMovimentacao">
        <input type="text" id="descricao" placeholder="Descrição" required>

        <input type="number" id="valor" placeholder="Valor" required>

        <select id="tipo" required>
          <option value="">Tipo</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <select id="categoria" required>
          <option value="">Categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Moradia">Moradia</option>
          <option value="Transporte">Transporte</option>
          <option value="Lazer">Lazer</option>
          <option value="Streaming">Streaming</option>
          <option value="Saúde">Saúde</option>
        </select>

        <select id="pagamento" required>
          <option value="">Forma de Pagamento</option>
          <option value="Cartão">Cartão</option>
          <option value="Pix">Pix</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Boleto">Boleto</option>
        </select>

        <button type="submit">Adicionar</button>
      </form>
    </section>

    <section class="lista">
      <h2>Movimentações</h2>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Pagamento</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody id="listaMovimentacoes">
        </tbody>
      </table>
    </section>
  </div>

  <script src="script.js"></script>
</body>
</html>
```

---

# style.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  background-color: #f4f6f9;
  padding: 30px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  font-size: 36px;
  color: #1f2937;
}

header p {
  color: #6b7280;
  margin-top: 10px;
}

.resumo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.card h2 {
  margin-bottom: 10px;
  font-size: 20px;
}

.card p {
  font-size: 28px;
  font-weight: bold;
}

.receita p {
  color: #16a34a;
}

.despesa p {
  color: #dc2626;
}

.saldo p {
  color: #2563eb;
}

.formulario,
.lista {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

input,
select,
button {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

button {
  background-color: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #1d4ed8;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  background-color: #f3f4f6;
}

@media (max-width: 768px) {
  .resumo {
    grid-template-columns: 1fr;
  }
}
```

---

# script.js

```js
const form = document.getElementById('formMovimentacao');
const listaMovimentacoes = document.getElementById('listaMovimentacoes');

const totalReceitas = document.getElementById('totalReceitas');
const totalDespesas = document.getElementById('totalDespesas');
const saldoFinal = document.getElementById('saldoFinal');

let movimentacoes = [];

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;
  const pagamento = document.getElementById('pagamento').value;

  const movimentacao = {
    descricao,
    valor,
    tipo,
    categoria,
    pagamento
  };

  movimentacoes.push(movimentacao);

  atualizarTabela();
  atualizarResumo();

  form.reset();
});

function atualizarTabela() {
  listaMovimentacoes.innerHTML = '';

  movimentacoes.forEach(item => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${item.descricao}</td>
      <td>${item.categoria}</td>
      <td>${item.pagamento}</td>
      <td>${item.tipo}</td>
      <td>R$ ${item.valor.toFixed(2)}</td>
    `;

    listaMovimentacoes.appendChild(linha);
  });
}

function atualizarResumo() {
  const receitas = movimentacoes
    .filter(item => item.tipo === 'receita')
    .reduce((acc, item) => acc + item.valor, 0);

  const despesas = movimentacoes
    .filter(item => item.tipo === 'despesa')
    .reduce((acc, item) => acc + item.valor, 0);

  const saldo = receitas - despesas;

  totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
  totalDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
  saldoFinal.textContent = `R$ ${saldo.toFixed(2)}`;
}
```

---

# Como salvar no VS Code

1. Crie uma pasta chamada `controle-financeiro`
2. Dentro dela, crie os arquivos:
   - README.md
   - index.html
   - style.css
   - script.js
3. Copie cada bloco para o arquivo correspondente
4. Abra o index.html no navegador usando Live Server

