<template>
  <div>
    <canvas ref="histogramChartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'HistogramChart',
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.histogramChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });
  }
};
</script>
