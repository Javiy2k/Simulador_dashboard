const horaActual = document.getElementById('horaActual');

let datos = {
    temperatura: [],
    humedad: [],
    viento: [],
    bateria: []
};

let historicoChart;

function actualizarHora() {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    horaActual.textContent = hora;
}

function generarDatosAleatorios() {
    return {
        temperatura: Math.round((Math.random() * 25 + 15) * 10) / 10,
        humedad: Math.round(Math.random() * 40 + 30),
        viento: Math.round((Math.random() * 30 + 5) * 10) / 10,
        bateria: Math.round(Math.random() * 40 + 60)
    };
}

function obtenerClaseAlerta(tipo, valor) {
    const rangos = {
        temperatura: { alto: 35, medio: 30 },
        humedad: { bajo: 40, medio: 25 },
        viento: { alto: 25, medio: 15 },
        bateria: { bajo: 20, medio: 40 }
    };

    switch(tipo) {
        case 'temperatura':
            if (valor >= rangos.temperatura.alto) return 'alert-high';
            if (valor >= rangos.temperatura.medio) return 'alert-medium';
            return 'alert-normal';
        case 'humedad':
            if (valor <= rangos.humedad.bajo) return 'alert-high';
            if (valor <= rangos.humedad.medio) return 'alert-medium';
            return 'alert-normal';
        case 'viento':
            if (valor >= rangos.viento.alto) return 'alert-high';
            if (valor >= rangos.viento.medio) return 'alert-medium';
            return 'alert-normal';
        case 'bateria':
            if (valor <= rangos.bateria.bajo) return 'alert-high';
            if (valor <= rangos.bateria.medio) return 'alert-medium';
            return 'alert-normal';
        default:
            return 'alert-normal';
    }
}

function actualizarMetricas() {
    const nuevos = generarDatosAleatorios();

    Object.keys(nuevos).forEach(key => {
        datos[key].push(nuevos[key]);
        if (datos[key].length > 10) {
            datos[key].shift();
        }
    });

    document.getElementById('temperatura').textContent = `${nuevos.temperatura}°C`;
    document.getElementById('humedad').textContent = `${nuevos.humedad}%`;
    document.getElementById('viento').textContent = `${nuevos.viento} km/h`;
    document.getElementById('bateria').textContent = `${nuevos.bateria}%`;

    document.getElementById('tempCard').className = `card metric-card ${obtenerClaseAlerta('temperatura', nuevos.temperatura)}`;
    document.getElementById('humCard').className = `card metric-card ${obtenerClaseAlerta('humedad', nuevos.humedad)}`;
    document.getElementById('windCard').className = `card metric-card ${obtenerClaseAlerta('viento', nuevos.viento)}`;
    document.getElementById('battCard').className = `card metric-card ${obtenerClaseAlerta('bateria', nuevos.bateria)}`;

    actualizarEstadisticas();
    actualizarGrafico();
}

function calcularEstadisticas(array) {
    if (array.length === 0) return { max: 0, min: 0, promedio: 0 };

    const max = Math.max(...array);
    const min = Math.min(...array);
    const promedio = array.reduce((sum, val) => sum + val, 0) / array.length;

    return { max, min, promedio: Math.round(promedio * 10) / 10 };
}

function actualizarEstadisticas() {
    const stats = {
        temperatura: calcularEstadisticas(datos.temperatura),
        humedad: calcularEstadisticas(datos.humedad),
        viento: calcularEstadisticas(datos.viento),
        bateria: calcularEstadisticas(datos.bateria)
    };

    document.getElementById('tempMax').textContent = `${stats.temperatura.max}°C`;
    document.getElementById('tempMin').textContent = `${stats.temperatura.min}°C`;
    document.getElementById('tempProm').textContent = `${stats.temperatura.promedio}°C`;

    document.getElementById('humMax').textContent = `${stats.humedad.max}%`;
    document.getElementById('humMin').textContent = `${stats.humedad.min}%`;
    document.getElementById('humProm').textContent = `${stats.humedad.promedio}%`;

    document.getElementById('vientoMax').textContent = `${stats.viento.max} km/h`;
    document.getElementById('vientoMin').textContent = `${stats.viento.min} km/h`;
    document.getElementById('vientoProm').textContent = `${stats.viento.promedio} km/h`;

    document.getElementById('batMax').textContent = `${stats.bateria.max}%`;
    document.getElementById('batMin').textContent = `${stats.bateria.min}%`;
    document.getElementById('batProm').textContent = `${stats.bateria.promedio}%`;
}

function inicializarGrafico() {
    const ctx = document.getElementById('historicoChart').getContext('2d');

    historicoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 10}, (_, i) => `T-${9-i}`),
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: datos.temperatura,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Humedad (%)',
                    data: datos.humedad,
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Viento (km/h)',
                    data: datos.viento,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Batería (%)',
                    data: datos.bateria,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function actualizarGrafico() {
    if (historicoChart) {
        historicoChart.data.datasets[0].data = [...datos.temperatura];
        historicoChart.data.datasets[1].data = [...datos.humedad];
        historicoChart.data.datasets[2].data = [...datos.viento];
        historicoChart.data.datasets[3].data = [...datos.bateria];
        historicoChart.update('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    actualizarHora();
    setInterval(actualizarHora, 1000);

    for (let i = 0; i < 10; i++) {
        actualizarMetricas();
    }

    inicializarGrafico();

    setInterval(actualizarMetricas, 3000);
});
