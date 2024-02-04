<template>
  <div>
    <canvas ref="horizontalBarChartCanvas"></canvas>
    <h7>Blocked cookies vs Unblock</h7>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "HorizontalBarChart",
  props: {
    chartData: Object
  },
  mounted() {
    const ctx = this.$refs.horizontalBarChartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {
        indexAxis: 'y',
      }
    });
  }
};
</script>
