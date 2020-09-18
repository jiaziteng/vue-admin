module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app无需自己配置，使用预设值
    '@vue/cli-plugin-babel/preset'
  ],
  // 表示在开发环境下使用该插件
  'env': {
    'development': {
      //  babel-plugin-dynamic-import-node插件仅通过将所有import（）转换为require（）来做一件事。将所有异步组件都用同步的方式引入
      // 当您拥有大量页面时，此插件可以显着提高热更新的速度。
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      'plugins': ['dynamic-import-node']
    }
  }
}
