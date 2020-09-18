<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
// 判断是否使用外链，如果使用外链则使用css的蒙版技术来实现图标的生成
// 上面使用v-on="$listeners"是为了将组件的事件全部绑定在该元素上，防止click等事件绑定失败
// aria-hidden是无障碍阅读的一个属性,表示当触摸到该元素时，会跳过
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
/* currentColor是一个css3的属性，代表着当前文字的颜色，他代表着继承的css的color值 */
/* CSS 属性 mask 允许使用者通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域 */
.svg-icon {
  width: 1em;
  height: 1em;
  /* 在这里设置vertical-align是为了将侧边栏的文字与icon对齐，在其他的使用中都使用了float:left,float：left会使vertical-align失效因此没有副作用 */
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
