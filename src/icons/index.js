import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component
// 此文件在main.js中引入相当于执行了该文件，定义了全局组件
// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
// requireContext是一个函数拥有形参item,map会调用这个函数并自动导入文件
// 自动导入所有的svg,在这里require.context返回的是一个带有请求参数req的函数 ，这个函数用来请求文件，因此直接在map中使用相当于导入了所有的svg文件
requireAll(req)
