const form = document.getElementById('formMovimentacao');
const listaMovimentacoes = document.getElementById('listaMovimentacoes');
const totalReceitas = document.getElementById('totalReceitas');
const totalDespesas = document.getElementById('totalDespesas');
const saldoFinal = document.getElementById('saldoFinal');

const STORAGE_KEY = 'controle-financeiro-movimentacoes';

let movimentacoes = carregarDoStorage();

atualizarTabela();
atualizarResumo();

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const descricao = document.getElementById('descricao').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;
  const pagamento = document.getElementById('pagamento').value;

  const movimentacao = {
    id: Date.now(),
    descricao,
    valor,
    tipo,
    categoria,
    pagamento,
    data: new Date().toLocaleDateString('pt-BR')
  };

  movimentacoes.push(movimentacao);
  salvarNoStorage();
  atualizarTabela();
  atualizarResumo();

  form.reset();
});

function atualizarTabela() {
  listaMovimentacoes.innerHTML = '';

  if (movimentacoes.length === 0) {
    listaMovimentacoes.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">Nenhuma movimentação cadastrada</td></tr>';
    return;
  }

  movimentacoes.forEach(item => {
    const linha = document.createElement('tr');
    const classTipo = item.tipo === 'receita' ? 'tipo-receita' : 'tipo-despesa';
    const valorFormatado = formatarMoeda(item.valor);

    linha.innerHTML = `
      <td>${item.descricao}</td>
      <td>${item.categoria}</td>
      <td>${item.pagamento}</td>
      <td class="${classTipo}">${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</td>
      <td class="${classTipo}">${valorFormatado}</td>
      <td><button class="btn-remover" onclick="removerMovimentacao(${item.id})">Remover</button></td>
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

  totalReceitas.textContent = formatarMoeda(receitas);
  totalDespesas.textContent = formatarMoeda(despesas);
  saldoFinal.textContent = formatarMoeda(saldo);

  saldoFinal.className = saldo >= 0 ? 'saldo-positivo' : 'saldo-negativo';
}

function removerMovimentacao(id) {
  movimentacoes = movimentacoes.filter(item => item.id !== id);
  salvarNoStorage();
  atualizarTabela();
  atualizarResumo();
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvarNoStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movimentacoes));
}

function carregarDoStorage() {
  const dados = localStorage.getItem(STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}
