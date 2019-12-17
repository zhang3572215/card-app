<!-- set-meal -->
<template>
  <div class="setmeal">
    <div class="meal-list">
        <div :class="index==activeIndex?'sure meal-item':'meal-item'" v-for="(item,index) in productList" :key="item.product_id" @click="pickChange(index)">
            <p class='tit'>{{item.product_name}}</p>
            <div class='btn-group fn-clear'>
                <div class='fl btn-link sum'>
                    <span class='icon-ball1' style="background-image: url('../static/cwtx/ball1.png');">{{item.data}}G</span>
                </div>
                <div class='fl btn-link main-txt'>
                    <p class='txt'>{{0>item.desc?"不限量":(item.desc+"G")}}</p>
                </div>
                <div class='fl btn-link money'>
                    <p class='txt'>
                        ￥<i>{{item.price}}</i>                        
                    </p>
                    <!-- <p class='del'>
                        <span></span>
                        &nbsp;
                        <em class="icon icon-icon"></em>
                    </p> -->
                </div>
            </div>
            <div class='icon-right' style="background-image: url('../static/cwtx/sprite.png');"></div>
        </div>
    </div>
    <div class="bottom-btn-group">
        <button type="button" class="btn btn-primary" @click="submitForm">订购</button>
        <button type="button" class="btn btn-active" @click="toUserCenter">个人中心</button>
    </div>
    <!-- <div id='loader'></div> -->
	<uni-popup 
		ref="suitSelectPopup"
		type="center"
		inStyle="width:80%;border-radius: 1.6vw;">
		<div class="dialog-content">
		    <em class="iconfont iconjinggao"></em>
		    <p class="tit">请选择套餐</p>
		    <p class="smalltxt">选择确认套餐后，才可进行下一步</p>
		</div>
		<div class="dialog-footer">
		    <button type="button" class="btn-red" @click="$refs.suitSelectPopup.close()">确认</button>
		</div>
	</uni-popup>
	<uni-popup 
		ref="selectNextPopup"
		type="center"
		inStyle="width:80%;border-radius: 1.6vw;">
		 <div class="main-box fn-clear">
			<div class="fl">
				<div class="time-img">
					<img :src="clockIcon" alt="">
				</div>
				<p class="txt">
				请选择生效时间
				</p>
			</div>
			<div class="fl">
				<div class="icon-person" style="background-image: url('../static/cwtx/sprite.png');"></div>
			</div>
		</div>
		<div class="dialog-btn-group">
			<div :class="timeSuer==0?'btn sure':'btn'" @click="timeSuer=0">立即生效(本月)</div>
			<div :class="timeSuer==1?'btn sure':'btn'" @click="timeSuer=1">次月生效(下月)</div>
		</div>
		<div class="dialog-footer">
			<button type="button" class="btn btn-blue" @click="confirmMeal(timeSuer)">确认</button>
		</div>
	</uni-popup>   
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import { getOpenIdBy , getOpenIdByCode, getSiutStatus, getPayDataByWx } from '@/utils/ApiList.js'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
const app = getApp()
export default {
  data () {
    return {
        activeIndex: -1,
        timeSuer: 0,
		cardId: app.globalData.cardId
        // cardId: window.localStorage.getItem('CARD_ID') ||'',
    };
  },
  computed: {
    ...mapState('setMealList',[
      'clockIcon',
      'productList'
    ]),
    ...mapState([
      'openID',
	  'payMode'
    ])
  },
  mounted: function(){
    this.updateProductListBy(app.globalData.cardId)
  },
  methods: {
    ...mapActions('setMealList',[
        'updateProductListBy'
    ]),
	pickChange(num){
		this.activeIndex = num
	},
    submitForm: function () {
        if (this.activeIndex == -1) {
            this.$refs.suitSelectPopup.open()
        }else {
			this.$refs.suitSelectPopup.close()
            if (this.productList[this.activeIndex].allow_next_month=='允许'){
                this.$refs.selectNextPopup.open()
            }else {
                this.timeSuer = 0
                this.confirmMeal(0)
            }
        }
    },
    confirmMeal: function (val) {
		this.$refs.selectNextPopup.close()
        getSiutStatus({
            product_id: this.productList[this.activeIndex].product_id,
            card_no: this.cardId,
            effect_type: val
        }).then(res => {
            if (res.data.code == 0) {
				if (this.payMode=='直付模式') {
					this.toWxPay(val)
				}else {
					uni.navigateTo({
						url:"/pages/recharge?product_id="+this.productList[this.activeIndex].product_id+
						'&product_name='+this.productList[this.activeIndex].product_name+
						'&is_next_use='+val+
						'&amount='+this.productList[this.activeIndex].price
					})
				}
            }
        })
    },
	toWxPay(type){
		getPayDataByWx({
		    product_id: this.productList[this.activeIndex].product_id,
		    effect_type: type,
		    card_no: this.cardId
		}).then( res => {
		    if (res.statusCode==200) {
				uni.requestPayment({
				    provider: 'wxpay',
				    orderInfo: res.data.result, //微信、支付宝订单数据
				    success: function (res) {
						uni.showToast({
							title:'支付成功',
							icon: 'success'
						})
						let t = setTimeout(function(){
							uni.hideToast(t)
							uni.switchTab({
								url:'pages/user'
							})
						},2000)
				    },
				    fail: function (err) {
				        console.log('fail:' + JSON.stringify(err));
				    }
				});
			}
		})
	},
    toUserCenter: function () {
        uni.switchTab({url: '/pages/user'})
    }
  },
  components: {
    uniPopup
  }
}

</script>
<style>
	.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
		width: 90vw;
	}
</style>
<style scoped>
    .setmeal {
        width: 100%;
        background-color: #f5f5f5;
    }
    .meal-list {
        width: 100%;
        padding-top:4vw!important;
        padding-bottom: 36vw;
        background-color: transparent;
    }
    .meal-list .meal-item {
        margin: 4vw 4vw 0;
        padding: 1.333333vw 4vw;
        border: 1px solid #4379ec;
        position: relative;
        background-color: white;
        border-radius: 1.333333vw;
        box-shadow: 0.959px 10.958px 38px 0px rgba(67, 121, 236, 0.13)
    }
    .tit {
        font-size: 3.333333vw;
        line-height: 8vw;
        color: #333;
        border-bottom: 1px solid #f4f4f4;
    }
    .btn-group  {
        padding: 2.666667vw 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }
    .sum {
        width: 30%;
        flex: 3;
        border-right: 1px solid #f4f4f4;
    }
    .sum span {
        width: 14.8vw;
        height: 15.066667vw;
        margin: 2.666667vw 0;        
        display: inline-block;
        border-radius: 50%;
        font-size: 6.4vw;
        line-height: 16.266667vw;
        color: #4379ec;
		text-align: center;
        text-shadow: 0.279px 3.99px 6px rgba(55, 108, 221, 0.51);
        background-size: cover;
        background-repeat: no-repeat;
    }
    .main-txt {
        width: 40%;
        flex: 4;
        border-right: 1px solid #f4f4f4;
    }
    .main-txt .txt {
        font-size: 2vw;
        line-height: 4vw;
        padding: 1.333333vw;
        text-align: left;
        margin-top: 1.333333vw;
    }
    .money {
        width: 30%;
        flex: 3;
        display: flex!important;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .money .txt {
        font-size: 3.2vw;
        color: #4379ec;
        display: block;
    }
    .money .txt i {
        font-size: 8vw;
    }
    .money .del span {
        color: #999;
        font-size: 3.2vw;
        text-align: center;
        text-decoration: line-through;
    }
    .money .del .icon-icon {
        width: 3.333333vw;
        height: 3.466667vw;
        vertical-align: middle;
        display: inline-block;
        background: url('../static/cwtx/sprite.png') no-repeat -62.8vw -48.8vw;
        background-size: 77.066667vw 72.533333vw;
    }
    .sure .icon-right {
        display: inline-block!important;
        position: absolute;
        right: 0;
        bottom: 0;
		background-size: 77.066667vw 72.533333vw;
		background-repeat: no-repeat;
		background-position: -34.933333vw -23.733333vw;
		width: 8.133333vw;
		height: 8.933333vw;
    }
    .icon-right {
        display: none;
    }
    .btn {
		padding: 1.6vw 3.2vw;
		font-size: 4vw;
		line-height: 8.8vw;
		border-radius: 5px;
	}
    .bottom-btn-group {
        padding: 4vw;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #FFFFFF;
    }
    .bottom-btn-group .btn {
        display: block;
		width: 92vw!important;
        margin-bottom: 4vw;
    }
    .bottom-btn-group .btn:last-child {
        margin-bottom: 0;
    }
	.bottom-btn-group .btn-primary {
		width: 100%;
		color: #fff;
		background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
		background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
		background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
		background: linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
		box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    }
    .bottom-btn-group .btn-active {
        width: 100%;
		color: #fff;
		background: -moz-linear-gradient(-10deg, #ff9538 0%, #ffbb2c 100%);
		background: -webkit-linear-gradient(-10deg, #ff9538 0%, #ffbb2c 100%);
		background: -ms-linear-gradient(-10deg, #ff9538 0%, #ffbb2c 100%);
		background: linear-gradient(-10deg, #ff9538 0%, #ffbb2c 100%);
		box-shadow: 0 0.8vw 1.6vw 0 #ffbb2c
    }
    .dialog-content .iconfont {
        display: block;
        margin: auto;
        text-align: center;
        font-size: 12vw;
		line-height: 16vw;
        color: #ff0000;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .dialog-content .tit {
        color: #333;
        line-height: 8vw;
        font-size: 3.2vwz;
        border: none;
        
    }
    .dialog-content p {
        text-align: center;
    }
    .btn-red {
        width: 26.666667vw;
        display: block;
        margin: 4vw auto;
        background: #e61a1a;
        color: #fff;
        font-size: 3.2vw;
        height: 6.666667vw;
        line-height: 6.666667vw;
    }
    .main-box {
        padding: 4vw;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
    }
    .fl {
        width: 50%;
        flex: 1;
        display: block;
    }
    .time-img{
        width: 8vw;
        height: 8vw;
        display: block;
		margin: 0;
		border-radius: 50%;
		overflow: hidden;
    }
    .main-box .fl .txt {
        color: #333;
        font-size: 4.266667vw;
        line-height: 10.666667vw;
    }
    .fl .icon-person {
        width: 25.6vw;
        height: 21.733333vw;
        display: block;
		float: right;
        background-size: 77.066667vw 72.533333vw!important;
		background-repeat: no-repeat;
		background-position: 0 0;
    }
    .dialog-btn-group {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .dialog-btn-group li  {
        width: 50%;
        flex: 1;
        margin: 0 4vw;
    }
    .dialog-btn-group .btn {
        flex-grow: 1;
        padding: 0;
        border: 1px solid #ccc;
        border-radius: 1.333333vw;
        margin: 0 2.666667vw;
        line-height: 8vw;
        font-size: 3.2vw;
        color: #ccc;
    }
    .dialog-btn-group .sure {
        border-color: #4379ec;
        color: #4379ec;
    } 
    .btn-blue {
        width: 26.66667vw;
        padding: 0;
        display: inline-block;
        margin: 4vw;
        background: #4379ec;
        border-radius: 1.333333vw;
        color: #fff;
        font-size: 3.2vw;
        height: 6.66666vw;
        line-height: 6.66666vw;
    }
</style>