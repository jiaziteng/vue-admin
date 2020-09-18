import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 自动引入所有文件，
const modulesFiles = require.context('./modules', true, /\.js$/)

// 您不需要从'./modules/app'导入应用
// 它会自动需要modules文件中的所有vuex模块
// keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求（译者注：参考下面第二段代码中的 key）组成,数组中返回的是路径
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  // 得到模块的名字
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  // console.log(moduleName);
  // 一个上下文模块导出一个（require）函数，这个函数可以接收一个参数：request，来请求文件导出的数据，这一步也相当于导入了文件
  const value = modulesFiles(modulePath)
  console.log(value)
  // expoet default导出的应该通过defalut属性来接收
  modules[moduleName] = value.default
  return modules
}, {})
// 这里并没有定义全局state
const store = new Vuex.Store({
  modules,
  getters
})

export default store
