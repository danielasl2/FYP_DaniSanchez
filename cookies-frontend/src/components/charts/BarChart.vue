<template>
  <div>
    <canvas ref="barChartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "BarChart",
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.barChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {}
    });
  }
};
</script>
