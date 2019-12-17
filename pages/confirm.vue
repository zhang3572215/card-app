<!-- confirm -->
<template>
  <div class="uni-container" :style="{backgroundImage:'url('+bgTop+')'}">
    <div class="box" :style="{background: '#fff url('+confirmTopBg+') no-repeat top cebnter' }">
        <div class="type-img">
            <img :src="ispName|operatorFilter" alt="">
        </div>
        <div class="desc">
            <p>{{cardNo}}</p>
            <p>账户余额(元)：<i>{{balance}}</i></p>
            <p>卡状态：<i>{{bindStatus}}</i></p>
            <p></p>
        </div>
        <div class="btn">
            <!-- <a href="javascript:;" class='changebtn '>切换用户<em class='iconfont iconqiehuanzhanghao'></em></a> -->
        </div>
    </div>
    <div class="detail">
        <p class="tit">账户充值</p>
        <p class="smalltxt">请选择你要充值的额度</p>
        <ul class="item-list">
            <li v-for="(item,index) in amountList" :key="index" @click="toRecharge(index)">
                <p>{{item.value}}元</p>
                <p>到账：{{item.value+item.extra}}元</p>
            </li>
        </ul>
        <div class="input-group" v-if="payMode=='自定义金额'">
            <label @click ="checkChange" class="check-label">
				<checkbox value="checked"/>自定义金额
			</label>
            <div class="form-group" v-if="checked">
                <input type="number" class="form-input" :value="userValue" placeholder="输入金额" @blur="setUserValue">
                <button type="button" class="form-buttom" @click="payUserDefine">确定</button>
            </div>            
        </div>
        <div class="footer-bj">
            <img :src="confirmBottomBg" alt="">
        </div>
    </div>
	<uni-popup ref="cardStatusPopu" type="center" class="pop-opcity">
		<div class="modal-contex">{{modalContext}}</div>
	</uni-popup>
  </div>
</template>

<script>
import { mapState , mapActions } from 'vuex'
import { getRechargePayBy, getCheckCardByNumber, getDiacrisisResult } from '@/utils/ApiList.js'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import baseUrl from '@/utils/url.js'
const app = getApp()
export default {
  data () {
    return {
        active:1,
        checked: false,
        userValue:null,
        bindStatus: '未知',
		cardNo: app.globalData.cardId,
		payMode: app.globalData.payMode,
		modalContext: '',
		balance: app.globalData.balance
        // cardNo: window.localStorage.getItem('CARD_ID')||'',
        // openId: window.localStorage.getItem('OPEN_ID')||'o22KC0VRz4RIFeduIDFb82aLi8iE',
    };
  },
  computed: {
    ...mapState('confirmData',[
        'bgTop',
        'confirmTopBg',
        'confirmBottomBg',
        'amountList'
    ]),
    ...mapState([
        'openID',
        'ispName'
    ])
  },
  mounted: function(){
    if (this.cardNo !='') {
		getCheckCardByNumber(this.cardNo).then(res => {
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
				app.globalData.certStatus = res.data.cert_status
				app.globalData.payMode = res.data.pay_mode
				this.payMode = res.data.pay_mode
				this.bindStatus = res.data.status
            }
		})
    }
  },
  methods: {
      toRecharge: function (index) {
        let that = this
        if (that.cardNo == '') {
            that.$router.push('/change')
        }else {
            getRechargePayBy({
                amount: that.amountList[index].value,
                card_no:  app.globalData.cardId,				
				open_id: that.openID
            }).then( res => {
				console.log(res)
                if (res.statusCode == 200 && typeof(res.data.result) != 'undefined') {        //请求成功                    
                    uni.requestPayment({
                        provider: 'wxpay',
                        orderInfo: res.data.result, //微信、支付宝订单数据
                        success: function (res) {
                            // console.log('success:' + JSON.stringify(res));
                    		getCheckCardByNumber(app.globalData.cardId).then(res2 => {
                    			app.globalData.balance = res2.data.balance
                    			app.globalData.certStatus = res2.data.cert_statu
                    		})
                        },
						fail: err => {
							console.log('err:' + JSON.stringify(err));
						}
                    });
                }else {
					that.reBindOpenId(index,1)
				}
            })
        }        
      },
      payUserDefine:function () {
          let that = this
          if (that.userValue > 0){
			getRechargePayBy({
				amount: that.userValue,
				card_no:  app.globalData.cardId,
				open_id: that.openID
			}).then( res => {
				if (res.statusCode == 200 && typeof(res.data.result) != 'undefined') {        //请求成功                    
					uni.requestPayment({
					    provider: 'wxpay',
					    orderInfo: res.data.result, //微信、支付宝订单数据
					    success: function (res) {
					        // console.log('success:' + JSON.stringify(res));
							getCheckCardByNumber(app.globalData.cardId).then(res2 => {
								this.updateBalanceBy(res2.data)
								app.globalData.balance = res2.data.balance
								app.globalData.certStatus = res2.data.cert_statu
							})
					    },
					    fail: function (err) {
					        console.log('fail:' + JSON.stringify(err));
					    }
					});
				}else {					
					that.reBindOpenId(0,0)
				}
			})
          }else {
			  uni.showToast({
			      title: '请输入大于0的数字',
			      duration: 1000
			  });
		  }
      },	  
	  reBindOpenId(index,type){
	  	uni.request({
	  		url:baseUrl + 'wx/app_user_info',
	  		method: 'POST',
	  		data: {
	  			open_id: app.globalData.openId,
	  			union_id: app.globalData.unionId,
	  			nike_name: app.globalData.nickName,
				sex: '',
				city: '',
				province: '',
				country: '',
	  			head_img_url:app.globalData.avatarUrl
	  		},
	  		success: resData=>{
	  			// console.log(resData)
	  			if (typeof(resData.data.data.card_no) != 'undefined' && resData.data.data.card_no !='') {
					console.log('绑定成功'+resData)
					if (type==1){
						return this.toRecharge(index)
					}else {
						return this.payUserDefine()
					}
	  			}
	  		},
	  		fail: err => {
	  			console.log(err)
	  		}
	  	})
	  },
	  setUserValue(e){
		  let that = this
		  if (e.detail.value > 0) {
			 that.userValue = e.detail.value 
		  }else {
            uni.showToast({
                title: '请输入大于0的数字',
                duration: 1000
            });
          }
	  },
	  checkChange(){
		  this.checked=!this.checked
	  },
      ...mapActions('userData',[
          'updateBalanceBy'
      ]),
      ...mapActions([
          'asyncSetting'
      ])
  },
  components: {
    uniPopup
  }
}

</script>
<style>
.input-title .el-checkbox__label{
    font-size: 3.2vw!important;
}
.input-group .el-checkbox {
    line-height: 8vw;
}
.el-message-box__wrapper {
    width: 100%;
}
.el-message-box {
    width: 80%!important;
    margin: 0 auto;
    z-index: 40!important;
}
</style>
<style scoped>
.uni-container {
    width: 100%;
    padding: 16vw 0;
    min-height: 200px;
    background-position: top center;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #f5f5f5;
}
.box {
    margin: 16vw 4vw 0 4vw;    
    background-size: cover;
    background-color: #fff;
    border-radius: 1.333333vw;
    padding-bottom: 4vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.type-img {
    width: 26vw;
	height: 26vw;
    flex: none;
    box-sizing: border-box;
    padding: 2.666667vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.type-img img {
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
}
.desc {
    min-width: 50%;
    margin-top: 5.333333vw;
}
.desc p {
    height: 5.333333vw;
    text-align: left;
    font-size: 3.2vw;
    line-height: 5.333333vw;
    color: #666;
}
.desc p i {
	display: inline;
    color: #4379ec;
}
.detail {
    padding: 4vw;
}
.detail .tit {
    font-size: 3.6vw;
    color: #333;
}
.detail .smalltxt {
    font-size: 2.4vw;
    color: #333333;
    margin-bottom: 4vw;
    text-align: left;
}
.item-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    flex-wrap: wrap;
}
.item-list li {
    width: 30%;
    background: #4379ec;
    border-radius:1.333333vw;
    margin: 1.333333vw 1.666666%;
    padding: 2.666667vw 0;
}
.item-list li p {
    font-size: 3.466667vw;
    text-align: center;
    color: white;
}
.item-list li.sure {
    background: #4379ec;    
}
.item-list li.sure p {
    color: #fff;
}
.default-btn {
    width: 100%;
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
    width: 90%;
	height: 200rpx;
    display: block;
    margin: 8vw auto 4vw;
}
.footer-bj img {
	max-height: 100%;
}
.input-group {
    width: 100%;
    padding: 4vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.input-title {
    flex: none;
}
.form-group {
    flex: auto;
    padding: 0 0 0 4vw;
    text-align: left;
}
.check-label {
	line-height: 8vw;
}
.form-input {
    width: 8em;
    height: 8vw;
    flex: 3;
    display: inline-block;
	vertical-align: middle;
    font-size: 4vw;
    line-height: 8vw;
    color: #333;
    padding: 0 0.5em;
    border: 1px solid #999;
    border-radius: 0.8vw;
    transition: border-color 0.2s,box-shadow 0.2s;
}
.form-input:focus {
    border-color: #4379ec;
    box-shadow: #4379ec 0 0 4px 0  ;
}
.form-buttom {
    flex: 2 none;
    width: 4em;
    display: inline-block;
	vertical-align: middle;
    margin-left: 1em;
    line-height: 8vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    color: #fff;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);    
}
.pop-opcity {
	background-color: transparent;
}
</style>