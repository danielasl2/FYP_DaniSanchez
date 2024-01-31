<template>
  <div>
    <canvas ref="doughnutChartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "DoughtnutChart",
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.doughnutChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: this.chartData,
      options: {}
    });
  }
};
</script>