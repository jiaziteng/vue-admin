module.exports = {
  // 用 `vue-jest` 处理 `*.vue` 文件
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  // 用 `vue-jest` 处理 `*.vue` 文件
  // 用 `babel-jest` 处理 js
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  //  支持源代码中相同的 `@` -> `src` 别名
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // 快照的序列化工具
  snapshotSerializers: ['jest-serializer-vue'],
  // 告诉jest那些是测试文件
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  // 定义需要收集测试覆盖率信息的文件
  collectCoverageFrom: ['src/utils/**/*.{js,vue}', '!src/utils/auth.js', '!src/utils/request.js', 'src/components/**/*.{js,vue}'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  // 'collectCoverage': true,
  'coverageReporters': [
    'lcov',
    'text-summary'
  ],
  testURL: 'http://localhost/'
}
