<template>
  <div class="container">
	<div class="head-tip">
		<em class="iconfont iconjinggao"></em>
		<span>根据国家工信部《信息登记规定》（部令第25号）现所有物联网卡都需要实名认证，给您带来了不便，还请谅解。</span>
	</div>
	<div class="item-title">实名认证</div>
	<form>
		<div class="form">
			<div class="form-control">
				<label for="cardNumber" class="control-label">卡号</label>
				<input type="text" id="cardNumber" placeholder="请输入卡号" class="form-input form-input-group" v-model="submitData.card_no" disabled>
			</div>
			<div class="form-control">
				<label for="uname" class="control-label">姓名</label>
				<input type="text" id="uname" placeholder="请输入姓名" class="form-input form-input-group" v-model="submitData.name">
			</div>
			<div class="form-control">
				<label for="uIdCard" class="control-label">身份证号</label>
				<input type="text" id="uIdCard" placeholder="请输入身份证号" class="form-input form-input-group" v-model="submitData.identity_no">
			</div>
			<div class="form-control">
				<label for="uphone" class="control-label">手机号</label>
				<input type="number" id="uphone" placeholder="请输入手机号" class="form-input form-input-group" v-model="submitData.phone">
			</div>
			<div class="form-control">
				<label for="uphone" class="control-label">验证码</label>
				<div class="form-input-group">
					<input type="text" id="code" placeholder="验证码" class="form-input" v-model="submitData.sms_code">
					<div :class="btnClass" v-show="btnActive" @click="setTimer">获取验证码</div>
					<div :class="btnClass" v-show="!btnActive" >{{cntNum}}(S)后获取</div>
				</div>				
			</div>
		</div>	  		
		<div class="home-btn-group">
			<button type="button" class="btn btn-primary" @click="toPostData">提交申请</button>
		</div>
		<p class="bottom-tips">温馨提醒：不实名会断网或被销户，充值正常！</p>
	</form>
  </div>  
</template>

<script>
import { getCodeByPhone, getAuthPrePay, getCheckCardByNumber } from '@/utils/ApiList.js'
import { mapState, mapActions } from 'vuex'
import baseUrl from '@/utils/url.js'
const app = getApp()
export default {
  name: 'home',
  data (){
  	return {
		submitData:{
			card_no: app.globalData.cardId,
			name: '',
			phone:'',
			sms_code: '',
			identity_no:''
		},
		authTimes: 0,
		dataErrTip:{
			name: '姓名不能为空',
			sms_code: '验证码不能为空'
		},
		btnActive: true,
		btnTimer: 0,
		cntNum: 59,
		hasErr: 0
  	}
  },
  computed: {
	btnClass(){
		return  {
			btn: true,
			'btn-identify': this.btnActive,
			'btn-unable': !this.btnActive
		}
	},
	...mapState([
		'openID'
	])
  },
  mounted: function(){
	clearInterval(this.btnTimer)
	this.btnTimer = 0
	this.getCardInfo()
  },
  methods:{
	setTimer(){
		let that = this
		if (!(/^1[3456789]\d{9}$/).test(that.submitData.phone)){
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return 1
		}
		uni.request({
			url: baseUrl+'wx/send_sms_code',
			method: 'POST',
			data: {
				phone_number:that.submitData.phone
			},
			success:res => {
				uni.showToast({
					title: '验证码发送成功',
					icon: 'none'
				})
				that.btnActive=false
				that.btnTimer = setInterval(that.cntNumDown,1000)
			}
		})
	},
	cntNumDown:function () {
		if (this.cntNum>1){
			this.cntNum-=1
		}else {
			this.cntNum=59
			btnActive=true
			clearInterval(this.btnTimer)
			this.btnTimer = 0
		}
	},
	toPostData(){
		let that = this
		if (!(/^\d{17}[\d,X,x]$/).test(that.submitData.identity_no)){
			uni.showToast({
				title: '身份证号格式不正确',
				icon: 'none'
			})
			return 0
		}
		if (!(/^1[3456789]\d{9}$/).test(that.submitData.phone)){
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return 1
		}
		for (let item in that.dataErrTip){
			if (that.submitData[item]==''){
				uni.showToast({
					title: that.dataErrTip[item],
					icon: 'none'
				})
				return 3
			}
		}
		if (that.authTimes > 0) {					
			uni.request({
				url: baseUrl+'wx/auth_pre_pay_app',
				method: 'GET',
				data: {
					card_no:that.submitData.card_no
				},
				success:preRes => {
					if (preRes.statusCode == 200 || preRes.data.code == 0) {        //请求成功
						uni.requestPayment({
						 provider: 'wxpay',
						 orderInfo: preRes.data.result, //微信、支付宝订单数据
							success:res => {
								that.postAuthData()
							}
						})
					}
				}
			})
		}else {
			that.postAuthData()
		}
	},
	postAuthData(){
		let that = this
		uni.request({
			url: baseUrl+'wx/identity_auth',
			method:'POST',
			data: that.submitData,
			success:res => {
				if (res.data.code==0){
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						confirmText: '确定',
						showCancel: false,
						complete: action => {
							that.getCardInfo()
							uni.switchTab({
								url: '/pages/user'
							})
						}
					})
				}else {
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						confirmText: '确定',
						showCancel: false,
						complete: action => {
							uni.navigateTo({
								url: '/pages/pre-certify'
							})
						}
					})
				}
			}
		})
	},
	async getCardInfo(){
		let data = await getCheckCardByNumber(this.submitData.card_no).then(res => {
			// console.log(res)
			if (res.statusCode == 200 && res.data.card_no!='') {
				this.asyncSetting({
					ispName:res.data.operator,
					docUrl:res.data.use_doc_url,
					passwordExist:res.data.password_exist,
					needUnbind:res.data.need_unbind,
					supportRecover:res.data.support_recover,
					payMode: res.data.pay_mode,
					needAuth: res.data.need_auth,
					certStatus: res.data.cert_status,
					can_tg: res.data.can_tg,
					changeCard: res.data.change_card,
					cardChgStu: res.data.change_status
				})
				this.authTimes = res.data.auth_times
			}
		})
	},
	...mapActions([
		'asyncSetting'
	])
  },
  components: {
  }
}
</script>
<style>
.el-message-box__wrapper {
    width: 100%;
}
.el-message-box {
    width: 80%;
    margin: 0 auto;
    z-index: 3000!important;
}
.v-modal {
    z-index: 30!important;
}
</style>
<style scoped>
.head-tip {
	display: block;
	padding: 4vw 4vw 2vw;
	background-color: #f0f0f0;
}
.head-tip .iconjinggao {
	display: inline;
	padding-right: 0.5em;
	font-size: 3.2vw;
	line-height: 1.2em;
	color: #bbb;
}
.head-tip > span {
	font-size: 3.2vw;
	line-height: 1.2em;
	color: #bbb;
}
.item-title {
	padding: 3.2vw;
	/* background-image: url('../assets/images/headerbj.jpg');
	background-size: cover; */
	color: #fff;
	background-color: #759df4;
}
.form {
	padding: 0 4vw 2vw;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
}
.form-control {
	padding: 2vw 0;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid #ddd;
}
/* .form-control + .form-control {
	border-top: 1px solid #ddd;
} */
.form-control .control-label {
	flex: none;
	flex-basis: 6em;
	padding: 1.6vw 4vw 1.6vw 0;
	text-align: left;
}
.form-input-group {
	flex: auto;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.form-input-group .btn {
	flex: none;
	width: 7em;
	flex-basis: 7em;
	padding: 1.6vw 0;
	font-size: 3.2vw;
	line-height: 1em;
	text-align: center;
	border-radius: 3.2vw;
	border: 1px solid #ddd;
	/* transition: border-color 0.5s ease-in-out,color 0.5s ease-in-out,box-shadow 0.5s ease-in-out; */
}
.btn.btn-identify {
	border-color: #4379ec;
	color: #4379ec;
	box-shadow:  0 0 1px 0 #4379ec;
}
.btn.btn-unable {
	border-color: #ccc;
	color: #ccc;
	box-shadow:  0 0 1px 0 #ccc;
}
.form-input-group .form-input {
	flex: 1 auto;
	width: 6em;
	flex-basis: 6em;
}
.form-input {
	padding: 1.6vw 3.2vw;
	border-radius: 0.8vw;
	outline: none;
	border: none;
}
.home-btn-group {
	padding: 4vw 8vw;
}
.btn {
	padding: 1.6vw 3.2vw;
	font-size: 4vw;
	line-height: 8.8vw;
	border-radius: 5px;
}
.home-btn-group .btn-primary {
	color: #fff;
	display: block;
	background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	background: linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
}
.bottom-tips {
	padding: 4vw;
	font-size: 4vw;
	line-height: 1.25em;
	color: #999;
	text-align: center;
}
</style>