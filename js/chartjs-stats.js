/**
 * CHART.JS - GRÁFICO DE ESTADÍSTICAS INTERACTIVO
 * 
 * Este script crea un gráfico interactivo con Chart.js que muestra
 * estadísticas de productos (ventas, valoración, inventario).
 * 
 * Características:
 * - Animación suave al cargar
 * - Cambio de datos con botones
 * - Colores personalizados
 * - Interactividad en hover
 */

let chart = null;

// Datos para diferentes tipos de gráficos
const chartDatasets = {
  sales: {
    label: 'Unidades Vendidas',
    data: [450, 380, 290, 210, 185],
    backgroundColor: [
      'rgba(2, 117, 179, 0.8)',
      'rgba(224, 210, 58, 0.8)',
      'rgba(190, 224, 206, 0.8)',
      'rgba(44, 187, 121, 0.8)',
      'rgba(255, 165, 0, 0.8)',
    ],
    borderColor: [
      'rgb(2, 117, 179)',
      'rgb(224, 210, 58)',
      'rgb(190, 224, 206)',
      'rgb(44, 187, 121)',
      'rgb(255, 165, 0)',
    ],
    borderWidth: 2,
  },
  rating: {
    label: 'Calificación (de 5)',
    data: [4.8, 4.6, 4.7, 4.4, 4.2],
    backgroundColor: [
      'rgba(255, 215, 0, 0.8)',
      'rgba(255, 195, 0, 0.8)',
      'rgba(255, 165, 0, 0.8)',
      'rgba(255, 140, 0, 0.8)',
      'rgba(255, 100, 0, 0.8)',
    ],
    borderColor: [
      'rgb(255, 215, 0)',
      'rgb(255, 195, 0)',
      'rgb(255, 165, 0)',
      'rgb(255, 140, 0)',
      'rgb(255, 100, 0)',
    ],
    borderWidth: 2,
  },
  inventory: {
    label: 'Unidades en Stock',
    data: [85, 120, 45, 200, 75],
    backgroundColor: [
      'rgba(44, 187, 121, 0.8)',
      'rgba(52, 211, 153, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(22, 163, 74, 0.8)',
      'rgba(16, 185, 129, 0.8)',
    ],
    borderColor: [
      'rgb(44, 187, 121)',
      'rgb(52, 211, 153)',
      'rgb(34, 197, 94)',
      'rgb(22, 163, 74)',
      'rgb(16, 185, 129)',
    ],
    borderWidth: 2,
  },
};

// Etiquetas de los sets
const labels = [
  '🍫 Willy Wonka',
  '⭐ Star Wars',
  '🍔 Krusty Burger',
  '🏰 Castillo Medieval',
  '🚗 Coche Vintage',
];

/**
 * Inicializa el gráfico con los datos de ventas
 */
function initChart() {
  const ctx = document.getElementById('statsChart');
  
  if (!ctx) {
    console.error('Canvas con id "statsChart" no encontrado');
    return;
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [chartDatasets.sales],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#0275B3',
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(2, 117, 179, 0.9)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          borderColor: 'rgb(224, 210, 58)',
          borderWidth: 2,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'Cantidad: ' + context.parsed.y;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 500,
          ticks: {
            font: {
              size: 12,
            },
            color: '#666',
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
              weight: 'bold',
            },
            color: '#333',
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

/**
 * Cambia los datos del gráfico al hacer clic en los botones
 * 
 * @param {string} chartType - Tipo de gráfico: 'sales', 'rating', 'inventory'
 */
function switchChart(chartType) {
  if (!chart) return;

  // Obtener el máximo para cada tipo de gráfico
  const maxValues = {
    sales: 500,
    rating: 5,
    inventory: 250,
  };

  // Actualizar datos
  chart.data.datasets[0] = chartDatasets[chartType];
  chart.options.scales.y.max = maxValues[chartType];

  // Actualizar título del eje Y
  const titles = {
    sales: 'Unidades Vendidas',
    rating: 'Calificación (de 5)',
    inventory: 'Unidades en Stock',
  };
  
  chart.data.datasets[0].label = titles[chartType];

  // Animar el cambio
  chart.update('active');
}

/**
 * Actualiza los estilos de los botones activos
 */
function updateButtonStyles(activeBtn) {
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-primary', 'text-white', 'shadow-lg');
    btn.classList.add('bg-gray-200', 'text-gray-700');
  });

  activeBtn.classList.add('active', 'bg-primary', 'text-white', 'shadow-lg');
  activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
}

// Event listeners para los botones
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar gráfico
  initChart();

  // Agregar eventos a los botones
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const chartType = this.dataset.chart;
      switchChart(chartType);
      updateButtonStyles(this);

      // Agregar efecto visual
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
    });
  });

  // Agregar estilo de transición a los botones
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.style.transition = 'all 0.3s ease';
  });
});
