const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  outputDir: 'dist',
  assetsDir: '',
  filenameHashing: false,

  pages: {
      popup: {
          entry: 'src/main.js', 
          template: 'public/index.html', 
          filename: 'popup.html'
      }
  },

  css: {
      extract: false
  }
})
