<template>
  <div>
    <canvas ref="barChartCanvas"></canvas>
    <h7> Number of Cookies per Website</h7>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.barChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
};
</script>