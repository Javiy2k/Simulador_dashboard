let valor = 0;
const valorSpan = document.getElementById('valor');
const btnIncrementar = document.getElementById('incrementar');
const btnDecrementar = document.getElementById('decrementar');

btnIncrementar.addEventListener('click', () => {
    valor++;
    valorSpan.textContent = valor;
});

btnDecrementar.addEventListener('click', () => {
    valor--;
    valorSpan.textContent = valor;
});
