'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js') //  在此文件设置了页面标题
// const webpack = require('webpack');// 添加全局变量，例如$可能会用到
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // 页面标题

// 如果您的端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac：sudo npm run
// 您可以通过以下方法更改端口：
// port = 9527 npm run dev或npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // 开发人员端口

// 所有配置项说明都可以在https://cli.vuejs.org/config/中找到
module.exports = {
  /**
   *如果您打算在子路径下部署网站，则需要设置publicPath，
   *例如GitHub Pages。如果您打算将网站部署到https://foo.github.io/bar/，
   *然后publicPath应该设置为“ /bar /”。
   *在大多数情况下，请使用'/'！
   *详细信息：https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    // 自己配置跨域，不用mock
    // proxy: {
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: '<url>',
    //     charigin: true,
    //     pathRewrite: {
    //       [`^${process.env.VUE_APP_BASE_API}`]: '' // 重写路径如果不重写会被解析为例如 http:域名/api/..这种形式因为我们不需要/api因此将其重写
    //     }
    //   }
    // },
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js') // 删掉这个来去除mock服务
  },
  configureWebpack: {
    // 在webpack的名称字段中提供应用程序的标题，以便
    // 可以在index.html中对其进行访问以注入正确的标题。
    name: name,
    // 添加全局变量的时候会用到，不要忘了添加全局变量的时候在eslint的globals添加该全局变量
    // plugins: [
    //   new webpack.ProvidePlugin({
    //   _: 'lodash'
    //   })
    // ],
    // 当所用的库以cdn导入时用下面这个配置
    // externals: {
    //   lodash: {
    //     commonjs: 'lodash',
    //     commonjs2: 'lodash',
    //     amd: 'lodash',
    //     root: '_'//添加到window上
    //   }
    // },
    // 配置 路径别名
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) { // 在此选项中添加各种loader
    // 可以提高第一个屏幕的速度，建议打开预加载
    // 可以提高第一个屏幕的速度，建议打开预加载
    config.plugin('preload').tap(() => [{
      rel: 'preload',
      // 忽略runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }])

    // 当页面很多时，它将导致太多无意义的请求,请跳转到cli文档查看关于他的详细解释
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    // 这里url-loader的处理排除了src/icons的svg因为这里的图片是用来做icon的因此用svg-prite-loader来处理
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
      // symbolId定义了所生成的symbol的id名称
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          // 内联到index.html 之中
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime`必须与runtimeChunk名称相同。默认是“运行时”
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                // 基础类库
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 仅打包最初依赖的第三方
                },
                // UI 组件库
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为一个包
                  priority: 20, // 权重必须大于libs和app，否则将打包到libs或app中
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                // 自定义非必要组件
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义您的规则
                  minChunks: 3, // 最小公用数，即这个包最少引用，关于这个属性可以查看webpack的官网，关于splitchunk
                  priority: 5, // 权重
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          // 抽离出runtime.js，因为runtime变化比较频繁,如果将它打包在app.js中的话,会导致app.js的频繁变化,不能很好的利用缓存
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
