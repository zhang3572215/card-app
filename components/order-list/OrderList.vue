<template>
  <div class="tabs">
    <div class="order-list" v-if="list.length > 0">
        <div class="order-item" v-for="(item,index) in list" :key="index">
            <div class="tit">
                <p class="order">订单编号：{{item.order_no}}</p>
                <p class="time">{{item.booking_time}}</p>
            </div>
            <div class="main-list">
                <div class="type-img">
                    <img :src="item.operator|operatorFilter" alt="运营商logo" v-if="listType==1">
                    <img :src="chongzhiImage" alt="运营商logo" v-else>
                </div>
                <div class="desc">
                    <p class="title">{{item.product_name}}</p>
                    <p class="time">生效时间：<i>{{item.effect_time}}</i></p>
                    <div class="faction">
						<p class="pay-text">支付方式：<i>{{item.pay_type}}</i> </p>
						<p class="price">订单金额：<i>￥{{item.amount}}</i>
                        </p>
					</div>
                </div>
            </div>
        </div>
    </div>
    <div class="order-list-bottom" v-if="list.length < 1">
      <p>暂无历史订单</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
const app = getApp()
export default {
  data () {
    return {
        // card_id: window.localStorage.getItem('CARD_ID') || '',
        // operator: window.localStorage.getItem('ISP_NAME') || ''
    };
  },
  props: {
	listType:{
		type: Number,
		default: 1
	}
  },
  computed: {
    ...mapState('recorderData',[
      'chongzhiImage',
	  'orderType',
    ]),
    ...mapState([
      'ispName'
    ]),
	list: function () {
		if (this.listType==2){
			return this.$store.state.recorderData.rechargeList
		}else {
			return this.$store.state.recorderData.orderList
		}
	}
  },
  mounted: function(){
  },
  methods: {
  },
  components: {}
}
</script>

<style scoped>
.order-list {
    padding: 4vw!important;
    background-color: transparent;
}
.order-list p {
    font-size: 6.4vw;
    line-height: 8vw;
    color: #666;
}
.order-list .order-item {
    padding: 1.333334vw 4vw 4vw;
    position: relative;
    background-color: white;
    border-radius: 1.333333vw;
    box-shadow: 0.959px 10.958px 38px 0px rgba(67, 121, 236, 0.13)
}
.order-list .order-item + .order-item {
    margin-top: 4vw;
}
.order-list .tit{
	border-bottom: 1px solid #eee;
}
.order-list .order {
  margin-top: 2vw;
	font-size: 2.666667vw;
	line-height: 4vw;
}
.order-list .time {
	font-size: 2.666667vw;
	line-height: 4vw;
	text-align: right;
  margin-bottom: 2vw;
}
.main-list {
	width: 100%;
	padding-top: 4vw;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
}
.type-img {
	width: 20vw;
	height: 20vw;
	flex: none;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.type-img img{
	max-width: 100%;
	max-height: 100%;
}
.desc {
	width: 80%;
	padding-left: 3.2vw;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
}
.desc .title {
	color: #333;
	font-size: 3.466667vw;
	line-height: 6.4vw;
}
.desc .time {
	font-size: 3.2vw;
    line-height: 6.4vw;
    color: #666;
}
.desc .time i {
	font-size: 3.2vw;
	color: #4379ec;
	display: inline;
}
.desc .faction {
	width: 100%;
    line-height: 6.4vw;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
}
.desc .faction p {
	display: inline;
}
.faction .pay-text{
	font-size: 3.2vw;
	color: #999;
	display: inline;
}
.faction .pay-text i {
	font-size: 3.2vw;
	color: #4379ec;
	display: inline;
}
.faction .price {
	font-size: 3.2vw;
	padding-left: 1em;
	color: #999;
}
.faction .price i {
	font-size: 5.333334vw;
    color: #333;
	display: inline;
}
.order-list-bottom {
  padding:4vw!important;
}
.order-list-bottom p {
  font-size: 4.8vw;
  line-height: 6.4vw;
  color: #999;
  text-align: center;
}
</style>