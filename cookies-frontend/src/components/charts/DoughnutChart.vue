<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
    <div class="chart-title">Distribution of Cookies by Category</div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: this.chartData,
      options: {
      }
    });
  }
};
</script>