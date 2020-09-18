const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',//生成一个全局自增的整数
    timestamp: +Mock.Random.date('T'),//随机生成时间戳
    author: '@first',//随机生成英文名
    reviewer: '@first',//随即生成英文名
    title: '@title(5, 10)',//随机生成一句标题，其中每个单词的首字母大写
    content_short: 'mock data',
    content: baseContent,//
    forecast: '@float(0, 100, 2, 2)',//生成浮点数,值为0-100,且小数点为两位
    importance: '@integer(1, 3)',//生成1-3的随机整数
    'type|1': ['CN', 'US', 'JP', 'EU'],//从属性值 ['CN', 'US', 'JP', 'EU'] 中随机选取 1 个元素，作为最终值。
    'status|1': ['published', 'draft'],//同上
    display_time: '@datetime',//生成随机的时间字符串，例如1977-11-17 03:50:15
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',//生成300-5000的随机整数
    image_uri,
    platforms: ['a-platform']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query//es6对象解构

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

