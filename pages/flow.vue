<!-- recharge.vue -->
<template>    
  <div class="uni-container" :style="{backgroundImage:'url('+bgTop+')'}">
    <div class="flow-container">
        <div class="box" :style="{backgroundImage: 'url('+flowTopBg+')' }">
            <div class="type-img">
                <img :src="ispName|operatorFilter" alt="">
            </div>
            <div class="desc">
                <p>{{cardId}}</p>
                <p>账户余额(元)：<i>{{balance}}</i></p>
                <p>卡状态：<i>{{bindStatus}}</i></p>
                <p>到期日期：{{remainData.end_time}}</p>
            </div>
            <!-- <div class="flow-btn">
                <button type="button">切换用户</button>
            </div> -->
        </div>
    </div>
    <div class="detail">
        <div class="top-list fn-clear">
            <div class="fl once">
                <p class="tit">剩余流量</p>
                <p class="sum">{{remainData.total>=0?remainData.remain:'不限量'}}<em v-show="remainData.total>=0">M</em></p>
            </div>
            <div class="fl twice">
                <p class="txt">已用：<span class="msg">{{remainData.used>=0?(remainData.used+'M'):'0M'}}</span></p>
                <p class="txt">总流量：<span class="msg">{{remainData.total>=0?(remainData.total+'M'):'不限量'}}</span></p>
            </div>
        </div>
        <!-- <div class="present">
            <p class="txt">当前套餐：<span class="result">30G包月套餐</span></p>
            <p class="time">2019-06-01 00:00:00~~2019-06-30 23:59:59</p>
        </div> -->
    </div>    
    <div class="footer-bj">
        <img :src="flowBottomImg" alt="">
    </div>
    <div class="default-btn">
        <button type="button" @click="toMeals">订购</button>
    </div>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import { getDiacrisisResult, getCheckCardByNumber } from '@/utils/ApiList.js'
const app = getApp()
export default {
  data () {
    return {
        isPayByBalance: true,
        active: 1,
        bindStatus:'未知',
		cardId: app.globalData.cardId,
		balance: app.globalData.balance
        // card_id: window.localStorage.getItem('CARD_ID') || ''
    };
  },
  computed: {
    ...mapState('flowData',[
        'bgTop',
        'flowTopBg',
        'flowBottomImg',
        'remainData'
    ]),    
    ...mapState([
        'ispName',
        'needUnbind'
  	])  
  },
//   filters:{
//       numFilter: (num,totle) => {
//         if (totle > -1){
//             if ((null == num) || (num=='null')) return '0M'
//             if (num >= -1) {
//                 return num + 'M'
//             }else {
//                 return num + 'M'
//             }
//         }else {
//             return num > -1?(num+ 'M'):'不限量'
//         }          
//       }
//   },
  mounted: function(){
    if (app.globalData.cardId !='') {
		getCheckCardByNumber(app.globalData.cardId).then(res => {
			if (res.statusCode == 200 && res.data.card_no!='') {
                this.asyncSetting({
                    ispName:res.data.operator,
                    docUrl:res.data.use_doc_url,
                    passwordExist:res.data.password_exist,
					needUnbind:res.data.need_unbind,
					certStatus: res.data.cert_status,
					supportRecover:res.data.support_recover,
					payMode: res.data.pay_mode,
					canTg: res.data.can_tg
                })
                app.globalData.balance = res.data.balance
				this.balance = res.data.balance
                app.globalData.certStatus = res.data.cert_status
				this.bindStatus = res.data.status
            }
        })
    }
    this.updateRemainData(app.globalData.cardId)    
  },
  methods: {
    ...mapActions('flowData',[
        'updateRemainData'
    ]),
    ...mapActions([
        'asyncSetting'
    ]),
	toDiacrisis: ()=> {
		uni.navigateTo({url:'/pages/diacrisis'})
	},
	toMeals: ()=> {
		uni.navigateTo({url:'/pages/set-meals'})
	}
  },
  components: {
    
  }
}

</script>
<style scoped>
.uni-container {
    padding: 4vw 0;
    background-color: #f5f5f5;
    background-position: top center;
    background-size: 100% auto;
    background-repeat: no-repeat;
	overflow: hidden;
}
.flow-container .box {
    margin: 28vw 4vw 0 4vw;    
    background-size: 100% auto;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center right;
    border-radius: 1.333333vw;
    padding-bottom: 1vw; 
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.type-img {
    width: 20vw;
	height: 20vw;
    flex: none;
    box-sizing: border-box;
    padding: 2.666667vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
img  {
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
}
.desc {
    min-width: 50%;
    margin-top: 2.666667vw;
}
.desc p {
    text-align: left;
    font-size: 3.2vw;
    line-height: 5.333334vw;
    color: #666;
}
.desc p i {
    padding-left: 0.5em; 
    color: #4379ec;
	display: inline;
}
.flow-btn {
    width: 30%;
    padding: 4vw;
    display: block;
    position: relative;
}
.flow-btn button {
    width: 80%;
    position: absolute;
    top: 8vw;
    right: 4vw;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    line-height: 6.933333vw;
    font-size: 2.933333vw;
    border-radius: 6vw;
    color: #fff;
    text-align: center;
    display: block;
    box-sizing: border-box;
    padding: 0 1.333333vw;
}
.detail {
    margin: 4vw 4vw 0;
    background: #fff;
    border-radius: 1.333333vw;
}
.top-list {
    padding: 6.666667vw 4vw 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
}
.once {
    width: 60%;
    flex: 3;
}
.once .tit {
    font-size: 3.2vw;
    color: #999999;
    text-align: left;
    line-height: 5.333334vw;
	display: inline;
} 
.once .sum {
	padding-left: 1.6vw;
    font-size: 7.2vw;
    color: #333;
	display: inline;
}
.once .sum em {
	padding-left: 0.8vw;
    font-size: 4vw;
	display: inline;
}
.twice {
    width: 40%;
    flex: 2;
    margin-bottom: 4vw;
}
.twice .txt {
    font-size: 3.2vw;
    line-height: 5.333334vw;
    color: #999999;
}
.twice .txt .msg {
    color: #333;
}
.present {
    margin: 1.333334vw 4vw;
    border-top: 1px solid #ccc;
}
.present .txt {
    font-size: 3.2vw;
    text-align: left;
}
.present .txt .result {
    color: #4379ec;
    line-height: 8vw;
}
.present .time {
    font-size: 3.2vw;
    text-align: left;
    line-height: 8vw;
}
.default-btn {
    padding: 4vw;
}
.default-btn button {
    width: 100%;    
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);    
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    line-height: 12vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    color: #fff;
    text-align: center;
    display: block;
}
.footer-bj {
    width: 40vw;
	height: 25vw;
    display: block;
    margin: 21.333334vw auto 0;
}
.footer-bj img {
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
}
</style>