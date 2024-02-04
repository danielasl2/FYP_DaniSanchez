<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
    <h7>Distribution of Cookies for different Categories</h7>
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