module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port:8888,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
}
