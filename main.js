import Vue from 'vue'
import App from './App'

import pageHead from './components/page-head.vue'
import pageFoot from './components/page-foot.vue'
import uLink from '@/components/uLink.vue'
import store from './store'
import images from '@/utils/image-path.js'

// 添加统计
// const Stat = require('./statistics/dcloud-stat');
// Stat.init(Vue);

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.imgs = images  
Vue.prototype.jyJPush = uni.requireNativePlugin('JY-JPush')
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}

Vue.filter('operatorFilter',val => {
  if (!val) return ''
  switch (val) {
    case '联通':
      return images.liantongImage
      break;
    case '移动':
      return images.yidongImage
      break;
    case '电信':
      return images.dianxinImage
      break;
    default:
      return ''
      break;
  }
})
Vue.filter('DiacrisisFilter',val => {
  if (!val) return ''
  switch (val) {
    case '已激活':
      return '您的移动卡当前状态正常，无需解绑，如有问题，可查看使用说明或联系客服咨询。'
      break;
    case '已停用':
      return '您的流量卡当前已停机，请检查是否有剩余流量，是否订购套餐，如有问题，可联系客服咨询。'
      break;
    case '库存':
      return '您的流量卡当前暂未订购套餐，请检查是否订购套餐，如有问题，可联系客服咨询。（一般订购完套餐十分钟左右手机重启即可使用）'
      break;
    case '机卡分离':
      return '您的移动卡当前处于机卡分离状态，请将卡放进原卡槽，期间不要拔卡，第二天晚上手机重启下即可使用。（说明：处理时间为工作日内，当日分离，次日晚上恢复上网，手机重启即可。礼拜天需要周一晚上恢复，如需更换卡槽，可联系客服手动处理。）'
      break;
    default:
      return '卡片状态未知，如不能正常使用，请联系客服处理'
      break;
  }
})

Vue.component('page-head', pageHead)
Vue.component('page-foot', pageFoot)
Vue.component('uLink', uLink)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
