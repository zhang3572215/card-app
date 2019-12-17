import images from '@/utils/image-path'
import { getRecorderBy } from '@/utils/ApiList'
export default {
    namespaced: true,
    state: {
      navaInfo:{
        navaTitle: '消费订单',
        haveJump:false,
        rightLink:'',
        linkText:'',
      },
      chongzhiImage: images.chongzhiImage,
      orderList:[
      // {
      //   order_no:'2100068501190609173823222',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '移动扬天卡10G流量包',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00,
      //   operator: '移动'
      // },{
      //   order_no:'2100068501190609173823223',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '移动扬天卡10G流量包',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00,
      //   operator: '联通'
      // }
      ],
      rechargeList:[
      // {
      //   order_no:'2100068501190609173823224',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '余额充值',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00
      // },{
      //   order_no:'2100068501190609173823225',
      //   booking_time:'2019-06-09 17:38',
      //   product_name: '余额充值',
      //   effect_time: '2019-06-09 17:38',
      //   pay_type: 1,
      //   amount: 10.00
      // }
      ],
      orderType: 1
    },
    mutations: {
      syncOrderList (state, obj) {
        state.orderList = obj.product_orders
        state.rechargeList = obj.balance_orders
      // },
      // syncOrderType (state,val) {
      //   state.orderType = val
      }
    },   
    actions: {
      asyncOrderLisBy({ commit, state },card_num){
        getRecorderBy({
		  card_no:card_num
		}).then(res => {
			if (res.statusCode==200) {
				commit('syncOrderList',res.data)
				uni.hideLoading()
			}          
		}).catch(err=>{
			uni.hideLoading()
		})
      }
    }
  }