// ...existing code...
const horaActual = document.getElementById('horaActual');

function actualizarHora() {
     const ahora = new Date();
     const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
     horaActual.textContent = hora;
}

setInterval(actualizarHora, 1000);
actualizarHora();

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
