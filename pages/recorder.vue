<!-- set-meal -->
<template>
  <div class="uni-container">
    <div class="tab-bar">
      <div class="tab-bar-list">
        <div :class="current==1?'active tab-bar-item':'tab-bar-item'" @click="current=1">套餐订单</div>
        <div :class="current==2?'active tab-bar-item':'tab-bar-item'" @click="current=2" v-if="payMode!='直付模式'">余额订单</div>
      </div>
    </div>    
    
	<div class="swiper" :current='current' :duration="duration">
		<order-list
			:list-type='current'/>
	</div>
  </div>
</template>

<script>
import OrderList from '@/components/order-list/OrderList.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
const app = getApp()
export default {
  data () {
    return {
        timeSuer: 0,
		current: 1,
		duration: 500,
		cardId:app.globalData.cardId
        // card_id: window.localStorage.getItem('CARD_ID') || '',
        // operator: window.localStorage.getItem('ISP_NAME') || ''
    };
  },
  computed: {
    ...mapState('recorderData',[
      'navaInfo'
    ]),
    ...mapState([
      'ispName',
	  'payMode'
    ])
  },
  mounted: function(){
	uni.showLoading({
		title:'加载中'
	})
    this.asyncOrderLisBy(this.cardId)
  },
  methods: {
    ...mapActions('recorderData',[
      'asyncOrderLisBy'
    ])
  },
  components: {
    "order-list": OrderList
  }
}

</script>

<style scoped>
.uni-container {
    padding-top:4vw;
    background-color: #eee;
}
.tab-bar {
  width: 60vw;
  height: 13.6vw;
  margin: 0 auto;  
  padding:4vw 0 0!important;  
}
.tab-bar .tab-bar-list {
  width: 100%;
  height: 9.6vw;
  padding: 0.8vw;
  border-radius: 4.8vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
}
.tab-bar .tab-bar-item {
  flex: 1;
  height: 8vw;
  font-size: 4vw;
  line-height: 8vw;
  text-align: center;
  color: #333;
}
.tab-bar .tab-bar-item.active {
  border-radius: 4vw;
  color: white;
  background-color: #4379ec;
}
</style>