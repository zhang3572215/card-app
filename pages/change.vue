<!-- change card -->
<template>
  <div class="inquire" :style="{backgroundImage:'url('+bg+')'}">
    <div  class='logo'>
        <img :src="logoImage" alt="">
    </div>
    <p class='tit'></p>
    <div class='box'>
        <div class='btn-list'>
            <em class='iconfont iconqiahaoxinxichaxun'></em>
            <!-- 异步方式(单向数据流) -->
            <input type="text" class='input' :value="card_id" placeholder="请输入流量卡号" @input="updateCardId" @confirm="updateCardId"> <!-- @change="updateCardId" -->
            <em class='iconfont iconsaoyisao' @click="scanCodeBy"></em>
        </div>
        <button type="button" class='default-btn' @click="confirmCard">确定</button>
        <p class='smalltxt'>点击输入卡号右侧“扫一扫”图标，可直接扫码查询</p>
    </div>
	<uni-popup ref="pwdUnpassPopup" type="center">你输入的卡号不正确，请重新输入</uni-popup>
  </div>
</template>

<script>
import { getCheckCardByNumber } from '@/utils/ApiList.js'
import baseUrl from '@/utils/url.js'
import { mapState , mapActions } from 'vuex'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
const app = getApp()
export default {
  data () {
    return {
        logoImage:this.imgs.logoImg,
        bg:this.imgs.loginBg,
        card_id: app.globalData.cardId,
		target:''
    };
  },
  computed: {
	...mapState([
		'openID'
	])
  },
  mounted: function(){
  },
  onLoad:function(option) {
	if (typeof(option.target)!='undefined'&&option.target!='') {
		this.target = option.target
	}
  },
  methods: {
    updateCardId: function (e){
        app.globalData.cardId = e.detail.value
		this.card_id = e.detail.value
    },
    confirmCard: function (){
		let that = this
		getCheckCardByNumber(that.card_id).then(res=>{
			// console.log(res)
		    if (res.statusCode == 200 && res.data.card_no!='') {
				this.asyncSetting({
				    ispName: res.data.operator,
				    docUrl: res.data.use_doc_url,
				    passwordExist: res.data.password_exist,
					needUnbind: res.data.need_unbind,
					certStatus: res.data.cert_status,
				    supportRecover: res.data.support_recover,
					needAuth: res.data.need_auth,
					payMode: res.data.pay_mode,
					canTg: res.data.can_tg,
					changeCard: res.data.change_card,
					cardChgStu: res.data.change_status
				}) 
				app.globalData.cardId = res.data.card_no
				this.card_id = res.data.card_no
				app.globalData.balance = res.data.balance
				app.globalData.certStatus = res.data.cert_statu
				app.globalData.payMode = res.data.pay_mode
				app.globalData.docUrl = res.data.use_doc_url
				uni.request({
					url: baseUrl + 'wx/bind_card_no',
					method: "POST",
					data: {
						open_id: app.globalData.openId,
						source: 'app',
						card_no: res.data.card_no
					},
					complete(data) {
						// console.log(data)
						if (data.data.code != 0){
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
								success: function(data){
									// console.log(data)
									uni.request({
										url: baseUrl + 'wx/bind_card_no',
										method: "POST",
										data: {
											open_id: app.globalData.openId,
											source: 'app',
											card_no: res.data.card_no
										},
										complete(resData){
											console.log(resData)
											uni.setStorage({
												key: 'CARDID',
												data: res.data.card_no,
												success() {
													if (typeof(that.target)!='undefined' && that.target!=''){
														if (that.target=='user'){
															uni.switchTab({
																url:'/pages/user'
															})
														}else {
															uni.navigateTo({url:that.target})
														}
													}else {
													    uni.switchTab({
													    	url:'/pages/user'
													    })
													}
												}
											})
										}
									})
								},
							})
						}else {
							uni.setStorage({
								key: 'CARDID',
								data: res.data.card_no,
								success() {
									if (typeof(that.target)!='undefined' && that.target!=''){
										if (that.target=='user'){
											uni.switchTab({
												url:'/pages/user'
											})
										}else {
											uni.navigateTo({url:that.target})
										}
									}else {
									    uni.switchTab({
									    	url:'/pages/user'
									    })
									}
								}
							})
						}
					}
				})
		    }else {
		        // that.$refs.pwdUnpassPopup.open()
				app.globalData.cardId = ''
				uni.showToast({
					title: '你输入的卡号不正确，请重新输入',
					icon: "none"
				})
		    }
		})
        
    },
	checkCard:function () {
		let that = this
		getCheckCardByNumber(that.card_id).then(res=>{
			// console.log(res)
		    if (res.statusCode == 200 && res.data.card_no!='') {
				that.setPageData(res.data)
		    }else {
		        // that.$refs.pwdUnpassPopup.open()
				app.globalData.cardId = ''
				uni.showToast({
					title: '你输入的卡号不正确，请重新输入',
					icon: "none"
				})
		    }
		})
	},
	setPageData: function (data) {
		this.asyncSetting({
		    ispName:data.operator,
		    docUrl:data.use_doc_url,
		    passwordExist:data.password_exist,
			needUnbind:data.need_unbind,
		    supportRecover:data.support_recover,
			payMode: data.pay_mode,
			canTg: data.can_tg
		}) 
		app.globalData.cardId = data.card_no
		this.card_id = data.card_no
		uni.setStorageSync('CARDID',data.card_no)
		app.globalData.balance = data.balance
		app.globalData.certStatus = data.cert_statu
		app.globalData.payMode = data.pay_mode
	},
	scanCodeBy() {
		// 调起条码扫描
		let that = this
		uni.scanCode({
		    scanType: 'qrCode',								//目前仅支持二维码扫码
		    success: function (res) {
		        let str = res.result.slice(res.result.indexOf('state')+6)
				that.card_id = str
				app.globalData.cardId=str
				that.checkCard()
		    }
		});
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
.el-message-box {
    width: 60%;
    margin: 0 auto;
}
.el-message-box__title {
    font-size: 4vw;
}
.el-message-box__message p {
    font-size: 3.2vw;
}
</style>

<style scoped>
.inquire {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding-top: 20vw;
    position: absolute;
    background-color: #f4f4f4;
    background-size: cover;
    background-repeat: no-repeat;
}
.logo {
    width: 24vw;
    height: 24vw;
    margin: 0 auto 8vw;
    overflow: hidden;
}
.tit {
    color: #4379ec;
    font-size: 5.6vw;
    line-height: 8vw;
    text-align: left;
    padding: 0 6.666667vw 6.666667vw 6.666667vw;
}
.box {
    background: #fff;
    border-radius: 4vw;
    margin: 0 4vw;
    padding: 8vw 6.666667vw 0 6.666667vw;
}
.btn-list {
    display: flex;
	justify-content: space-between;
	align-items: center;
    border-bottom: 1px solid #8c8c8c;
}
.btn-list em {
    flex-grow: 1;
    font-size: 3.733333vw;
    line-height: 10.666667vw;
    color: #8c8c8c;
    text-align: center;
    display: inline-block;
}
.btn-list em:last-child {
    flex: none;
}
.btn-list input {
	flex: 0 60%;
    outline: none;
    background-color: transparent;
    border: none;
    text-align: left;
    flex-grow: 1;
    font-size: 3.733333vw;
    line-height: 10.666667vw;
    color: #8c8c8c;
    text-align: left;
    display: inline-block;
}
.default-btn {
    width:100%;
    margin-top: 5.333333vw;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    line-height: 12vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    color: #fff;
    text-align: center;
    display: block;
}
.smalltxt {
    line-height: 13.333333vw;
    color: #ccc;
    font-size: 2.666667vw;
}
</style>