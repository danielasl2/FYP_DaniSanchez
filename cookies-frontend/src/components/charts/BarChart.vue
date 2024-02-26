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
  watch: {
    chartData(newData, oldData) {
      if (this.chart && newData !== oldData) {
        this.chart.data = newData;
        this.chart.update();
      }
    }
  },
  mounted() {
  this.renderChart();
},

methods:  {
  renderChart(){
    const ctx = this.$refs.barChartCanvas.getContext('2d');
    this.chart = new Chart(ctx, {
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
}
}
</script>