<!-- recharge.vue -->
<template>    
  <div class="uni-container" :style="{backgroundImage:'url('+bgTop+')'}">
    <div class="recharge-container">
        <div class="recharge-title-group">
            <div class="recharge-title-tab">
                <div class="recharge-change-item">
                    <div class="recharge-item-name">流量卡号：{{cardId}}</div>
                    <div class="recharge-item-name">选择套餐：{{product_name}}</div>
                </div>
                <div class="cut-line"></div>
                <div class="recharge-change-btn" @click="toChangeSuit">
                    <span>更换<i class="iconfont iconqiehuanzhanghao"></i></span>
                </div>
            </div>
            <div class="recharge-title-content">
                <p class="recharge-content-item">可用余额： {{balance}}</p>
                <div class="recharge-swich-group" v-if="payMode=='通用模式'">
                   	<switch 
						checked 
						class="payment-mode"
						@change="isPayByBalance=$event.target.value"
						color="#0ebef"/>
                    <span class="recharge-swich-text">{{isPayByBalance?"余额支付":"微信支付"}}</span>
                </div>
                <button type="button" class="btn btn-active" @click="toUser">个人中心</button>
            </div>            
        </div>
    </div>
    <div class="mainbox">
      <div class="maintit">
        <p class="tit">充值余额</p>
        <p class="smalltxt">请选择您想要充值的余额</p>
      </div>
      <view class="uni-flex uni-row">
        <view class="btn-item flex-item"
            v-for="(item,index) in amountList"
            :key="index" 
            @click="toPayRecharge(index)">
			充{{item.value}}送{{item.extra}}
        </view>
      </view>
      <div class="input-group" v-if="payMode=='自定义金额'">
			<checkbox-group @change="checkedChange" class="user-define">
				<label class="user-label">
					<checkbox value="1" checked="checked" />自定义金额
				</label>
			</checkbox-group>
            <div class="form-group" v-show="checked">
                <input type="number" class="form-input" v-model="userValue" placeholder="输入金额">
                <button type="button" class="form-buttom" @click="payUserDefine">确定</button>
            </div>            
      </div>
    </div>
    <div class="default-btn">
        <button type="button" @click="toConfirm" class="active" v-if="!isTaped">立即支付</button>
        <button type="button" :disabled="!isTaped" class="disable" v-else>立即支付</button>
    </div>
	<uni-popup 
		ref="pwdInputPopup"
		in-style="width:80%;border-radius: 1.6vw;"
		@change="isTaped = $event.show"
		type="center">
		<div class="pwd-pop-head">
			<p class="pop-title">验证密码</p>
			<span @click="closeModefyPop" class="pop-close">X</span>
		</div>
		<div class="pwd-pop-body">
			<input type="password" id="passWord" class="pwd-input" v-model="passWord" placeholder="请输入密码">
		</div>		
		<div class="pwd-confirm-footer">
			<div @click="toChangePwd" v-if="passwordExist==1" class="default-btn">重置密码</div>
			<div @click="closeModefyPop" class="default-btn">取 消</div>
			<div class="primary-btn" @click="toBlancePay">确 定</div>
		</div>
	</uni-popup>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import { 
    getPayDataByWx,
    getRechargePayBy,
    getCheckCardByNumber,
    validPassWord,
    postPayDataBy,
    getSiutStatus
} from '@/utils/ApiList'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import baseUrl from '@/utils/url.js'
const app = getApp()
export default {
  data () {
    return {
		cardId:app.globalData.cardId,
        isPayByBalance: true,
        product_id: '',
        product_name: '',
		is_next_use: 0,
		payMode: app.globalData.payMode,
        passWord: '',
        userValue:null,
        checked: true,
        isTaped: false,
		balance: app.globalData.balance,
        amount: 0
    };
  },
  computed: {
    ...mapState('rechargeData',[
        'bgTop',
        'amountList',
        'orderInfo',
        'wxIcon',
        'balanceIcon'
    ]),
    ...mapState([
        'openID',
        'passwordExist'
    ])
  },
  watch:{
      isPayByBalance:function (newVal,oldVal) {
          if (newVal) {
              this.isTaped = false
          }
      }
  },
  onLoad:function(options){
	  this.product_id = options.product_id
	  this.product_name = options.product_name
	  this.amount = parseFloat(options.amount)
	  this.is_next_use = options.is_next_use
  },
  onShow() {
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
  	            app.globalData.certStatus = res.data.cert_statu
  	//             app.globalData.payMode = res.data.pay_mode
  				// this.payMode = res.data.pay_mode
				this.balance = res.data.balance
  	        }
  		})
  	}
  },
  mounted: function(){
    
  },
  methods: {
    toChangeSuit: function () {
		uni.navigateTo({url:'/pages/set-meals'})
    },
	toUser: function (){
		uni.switchTab({url:'/pages/user'})
	},
	checkedChange: function (e){
		console.log(e.detail.value[0])
	},
	closeModefyPop: function(){
		this.$refs.pwdInputPopup.close()
		this.isTaped = false
	},
    toChangePwd: function () {
		uni.navigateTo({url:'/pages/change-pwd'})
    },
    toConfirm:function () {
        if (app.globalData.cardId == '') {
            uni.navigateTo({url:'/pages/change'})
        }else if (this.product_id == '') {
            uni.navigateTo({url:'/pages/set-meals'})
        }else {
            getSiutStatus({
                product_id:this.product_id,
                card_no: this.cardId,
                effect_type: this.is_next_use,
            }).then(res => {
                if (res.data.code == 0) {
                    if (app.globalData.payMode=='通用模式' && !this.isPayByBalance) {
                        getPayDataByWx({
                            product_id: this.product_id,
                            effect_type: this.is_next_use,
                            card_no: this.cardId
                        }).then( res => {
                            if (res.statusCode == 200) {
								uni.requestPayment({
								    provider: 'wxpay',
								    orderInfo: res.data.result, //微信、支付宝订单数据
								    success: function (res) {
										getCheckCardByNumber(app.globalData.cardId).then(res => {
											app.globalData.balance = res.data.balance
											app.globalData.certStatus = res.data.cert_statu										
										})
								    },
								    fail: function (err) {
								        console.log('fail:' + JSON.stringify(err));
								    }
								});
							}
                        })
                    }else {
						if (this.balance < this.amount) {
							uni.showModal({
								title:'提示',
								content: '余额不足，请充值',
								showCancel: false,
							})
						}else {
							if (this.passwordExist==0) {
								uni.navigateTo({url:'/pages/set-password'})
							}else {
								this.$refs.pwdInputPopup.open()
								this.isTaped = true
							}
						}
                    }
                }else {
					uni.showToast({
						title:res.data.msg,
						icon: 'none'
					})
                }
            })
            
        }        
    },
    toBlancePay:function () {
		let that = this
        validPassWord({
            card_no:app.globalData.cardId,
            pay_password: that.passWord
        }).then(res => {
            that.blanceConfirm = false
            if (res.data.code==0) {
				uni.request({
					url: baseUrl+'wx/charge_with_balance',
					method:'POST',
					data: {
						card_no: app.globalData.cardId,
						product_id: that.product_id,
						effect_type: that.is_next_use,
						source: 'app'
					},
					success:res => {
						if (res.data.code==0) {
							uni.showModal({
							    title: '提示',
							    content: res.data.msg?res.data.msg:'支付成功',
								showCancel: false,
							    complete: function (res) {
									getCheckCardByNumber(app.globalData.cardId).then(res => {
										app.globalData.balance = res.data.balance
										app.globalData.certStatus = res.data.cert_statu
										that.blanceConfirm = false
									})
									this.$refs.pwdInputPopup.close()
							    }
							});
						}
					}
				})
            }else {
				uni.showToast({
					title:res.data.msg,
					icon: 'none'
				})
            }
        })
    },
    toPayRecharge:function (value) {
		let that = this
        if (app.globalData.cardId == '') {
            uni.navigateTo({url:'/pages/set-meals'})
        }else {
            getRechargePayBy({
                amount: that.amountList[value].value,
                card_no: app.globalData.cardId,
				open_id: that.openID
            }).then( res => {
                if (res.statusCode == 200) {        //请求成功                    
                    uni.requestPayment({
                        provider: 'wxpay',
                        orderInfo: res.data.result, //微信、支付宝订单数据
                        success: function (res) {
                            // console.log('success:' + JSON.stringify(res));
                    		getCheckCardByNumber(app.globalData.cardId).then(res => {
                    			app.globalData.balance = res.data.balance
                    			app.globalData.certStatus = res.data.cert_statu
								that.balance = res.data.balance
                    			that.blanceConfirm = false
								uni.showModal({
									title: '提示',
									content: '充值成功，您是否现在就订购已选套餐呢？',
									cancelText: '稍后购买',
									confirmText: '立刻购买',
									confirmColor: '#007aff',
									success: function () {
										getSiutStatus({
										    product_id:that.product_id,
										    card_no: that.cardId,
										    effect_type: that.is_next_use,
										}).then(stat => {
											if (stat.data.code == 0 ){
												if (res.data.balance > that.amount) {
													uni.request({
														url: baseUrl+'wx/charge_with_balance',
														method:'POST',
														data: {
															card_no: app.globalData.cardId,
															product_id: that.product_id,
															effect_type: that.is_next_use
														},
														success:payres => {
															if (payres.data.code==0) {
																uni.showToast({
																	title: payres.data.msg,
																	success: function () {
																		getCheckCardByNumber(app.globalData.cardId).then(checkres => {
																			app.globalData.balance = checkres.data.balance
																			app.globalData.certStatus = checkres.data.cert_statu
																			that.balance = checkres.data.balance
																		})
																	}
																});
															}
														}
													})
												}else {
													uni.showToast({
														title: '对不起卡内余额不足以支付该套餐',
														icon: 'none'
													})
												}
											}else {
												uni.showToast({
													title: stat.data.msg,
													icon: 'none'
												})
											}
										})
									}
								})
                    		})
                        },
                        fail: function (err) {
                            console.log('fail:' + JSON.stringify(err));
                        }
                    });
                }else {
					that.reBindOpenId()
				}
            })
        }        
    },
	reBindOpenId(){
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
				if (typeof(resData.data.data.card_no) != 'undefined' && resData.data.data.card_no !='') {
					console.log('绑定成功'+resData)
				}
			},
			fail: err => {
				console.log(err)
			} 
		})
	},
    payUserDefine: function() {
        if (app.globalData.cardId == '') {
            uni.navigateTo({url:'/pages/set-meals'})           
        }else {
            if (this.userValue > 0){
                getRechargePayBy({
                    amount: this.userValue,
                    card_no: app.globalData.cardId,
					open_id: this.openID
                }).then( res => {
                    if (res.statusCode == 200) {        //请求成功                    
                        uni.requestPayment({
                            provider: 'wxpay',
                            orderInfo: res.data.result, //微信、支付宝订单数据
                            success: function (res) {
                        		getCheckCardByNumber(app.globalData.cardId).then(res => {
                        			app.globalData.balance = res.data.balance
                        			app.globalData.certStatus = res.data.cert_statu
                        			this.blanceConfirm = false
                        		})
                            },
                            fail: function (err) {
                                console.log('fail:' + JSON.stringify(err));
								
                            }
                        });
                    }else {
						that.reBindOpenId()
					}
                })
            }else {
                // this.$alert('充值金额请请输入大于0的数字', '提示', {
                //     confirmButtonText: '确定'
                // })
				uni.showToast({
					title:'自定义金额中输入大于0的数字',
					icon: none
				})
            }            
        }        
    },
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

</style>
<style scoped>
.uni-container {
    background-color: #f5f5f5;
    background-position: top center;
    background-size: 100% auto;
    background-repeat: no-repeat;
}
.recharge-container {
    padding: 32vw 4vw 0;
}
.recharge-title-group {
    overflow: hidden;
    background-color: #ffffff;    
    border-radius: 1.333333vw;
}
.recharge-title-tab {
    padding:2.666667vw; 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;    
    border-bottom: 2px solid #eee;
}
.recharge-item-name {
    font-size: 3.2vw;
    line-height: 4vw;
    color: #333;
    text-align: left;
}
.recharge-change-btn {
    line-height:8vw;
}
.recharge-change-btn span{
    font-size: 3.6vw;
    line-height: 4.266667vw;
    vertical-align: middle;
	display: inline;
    color: #4379ec;
}
.recharge-change-btn span i {
	display: inline;
    vertical-align: middle;
}
.recharge-title-content {
    padding: 2.666667vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.recharge-content-item {
    font-size: 3.6vw;
    color: #666;    
    vertical-align: middle;
}
.recharge-swich-group {
    margin-left: 4vw;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.recharge-swich {
    transform: scale(0.8);
}
.recharge-swich-text {
    font-size: 3.6vw;
    color: #666; 
}
.recharge-title-content .btn-active {
    margin: 0 4vw 0 6vw;   
    background: -moz-linear-gradient(-10deg, #febc2c 0%, #f98014 100%);
    background: -ms-linear-gradient(-10deg, #febc2c 0%, #f98014 100%);
    background: -webkit-linear-gradient(-10deg, #febc2c 0%, #f98014 100%);
    box-shadow: 0 0.8vw 1.6vw 0 #febc2c;
    line-height: 6.933333vw;
    font-size: 2.933333vw;
    border-radius: 6vw;
    color: #fff;
    text-align: center;
    display: block;
    white-space: nowrap;
    padding: 0 3.2vw;
}
.mainbox {
    margin: 1.333333vw 4vw;
    border-radius: 1.333333vw;
    background: #fff;
	position: relative;
}
.maintit {
    margin: 0 0 4vw 4vw;
}
.maintit .tit {
    font-size: 4vw;
    line-height: 8vw;
    text-align: left!important;
}
.maintit .smalltxt {
    font-size: 3.2vw;
    line-height: 8vw;
}
.uni-row {
	width: 100%;
	flex-wrap: wrap;
	justify-content: space-between;
	align-content: flex-start;
    padding-bottom: 4vw;
	position: relative;
	box-sizing: border-box;
}
.uni-row .btn-item {
	flex: 1 0 30vw;
    margin: 1.333333vw 2vw;
    padding: 3.2vw;
	text-align: center;
    background-color: #f4f4f4;
    font-size: 4vw;
    border-radius: 1.6vw;
	position: relative;
	box-sizing: border-box;
}
.default-btn {
    padding: 4vw;
}
.default-btn button {
    line-height: 12vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    text-align: center;
    display: block;
}
.default-btn .active {
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);    
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    color: #fff;
}
.default-btn .disable {
    background-color: #ccc;
    color: #666;
}
.form-group {
    flex: auto;
    padding: 0 0 0 4vw;
    text-align: left;
}
.form-input {
    width: 8em;
    height: 8vw;
    flex: 3;
    display: inline-block;
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
    margin-left: 1em;
    line-height: 8vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    color: #fff;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);    
}
.payment-mode {
	transform: scale(0.6);
}
.input-group {
	padding: 4vw 2vw;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;	
}
.input-group .form-group {
	flex: 2;
	padding: 0;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.user-define {
	flex: 1;
	display: inline-block;
	line-height: 8vw;
}
.user-define .user-label{
	display: inline-block;
	height: 8vw!important;
	line-height: 8vw!important;
}
.pwd-pop-head {
	width: 100%;
	position: relative;
}
.pop-title {
	font-size: 4vw;
	line-height: 1em;
	color: #333;
}
.pwd-pop-head .pop-close {
	top: -2vw;
	right:-2vw;
	line-height: 1em;
	color: #999;
	position: absolute;
}
.pwd-pop-body {
	width: 100%;
	padding: 4vw 0;
	text-align: left;
	position: relative;
}
.pwd-pop-body input {
	height: 8vw;
	font-size: 4vw;
	line-height: 8vw;
	color: #333;
	padding: 0 0.5em;
	border: 1px solid #999;
	border-radius: 0.8vw;
}
.pwd-confirm-footer {
	width: 100%;
	line-height: 8vw;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.pwd-confirm-footer div {
	padding: 2.4vw 4vw;
	font-size: 3.2vw;
	line-height: 1em;
	border-radius: 1.6vw;
}
.pwd-confirm-footer .default-btn {
	color: #333;
	border: 1px solid #ccc;	
}
.pwd-confirm-footer .primary-btn {
	background-color: #4379ec;
	color: white;
}
</style>