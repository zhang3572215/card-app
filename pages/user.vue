<template>
	<view class="uni-container" :style="{backgroundImage:'url('+userData.bgTop+')'}" >
	    <div class="user-header">
			<p>{{nickName}}</p>
			<div class="avatar">
				<img :src="headImgUrl" alt="头像文件">
			</div>			
		</div>
		<div class="user-info-group">
			<div class="user-info-title">
				<span class="user-card-id">{{cardId}}
					<span class="user-card-chg" @click.stop="navaToChange">{{cardId!=''?'切换卡号':'绑定卡号'}}<i class="iconfont iconqiehuanzhanghao"></i></span>
				</span>
			</div>
			<div class="user-info-body">	
				<template v-if="payMode!='直付模式'">
				<div class="user-info-item">
					<p class="user-info-value">{{balance}}</p>
					<p class="user-info-key">卡内余额</p>
				</div>
				<div class="cut-line"></div>
				</template>
				<div class="user-info-item">
					<!-- <p :class="'user-info-value'+ userData.cert_status!=1?color-unverify:color-verified">{{userData.cert_status==1?'已认证':'未认证'}}</p> -->
					<p class="user-info-value color-verified">{{needAuth=='否'?'已认证':certStatus}}</p>
					<p class="user-info-key">认证状态</p>
				</div>
			</div>
		</div>
		<view class="user-menu">
			<view class="user-menu-item" v-for="item in menuListFilter" :key="item.id" @click="navaToPage(item.path)" v-show="item.isShow">
				<div class="user-menu-icon" :style="{backgroundImage:'url('+userData.icons+')'}">
				</div>
				<p class="user-menu-text">{{item.text}}</p>
			</view>
		</view>
		<div class="con-list" @click="toHelp">
			<div class="con-list-item">
				<span class="el-icon-s-comment"></span>使用说明
			</div>
			<div class="con-list-item con-list-color2">
				看看你的疑惑解决了么<span class="el-icon-arrow-right"></span>
			</div>
		</div>
		<!-- <div class="btn-group">
			<button type="button" class="btn btn-primary" @click="clearLocalStorage">清除缓存数据</button>
		</div> -->
	    
	</view>
</template>

<script>
	import { mapState, mapGetters, mapActions } from 'vuex'
	import { getCheckCardByNumber } from '@/utils/ApiList.js'
	const app = getApp()
	export default {
		data() {
			return {
				cardId: app.globalData.cardId,
				balance: app.globalData.balance,
				certStatus: app.globalData.certStatus || ''
			}
		},
		computed: {
		  	...mapState([
				'userData',
				'openID',
				'nickName',
				'headImgUrl',
				'docUrl',
				'passwordExist',
				'supportRecover',
				'needUnbind',
				'needAuth',
				'payMode',
				'changeCard'
				
			]),
			...mapGetters([
				'getHeadImgUrl',
				'getNickName',
			]),
			...mapGetters('userData',[
				'menuListFilter'
			])
		},
		mounted: function(){
			let that = this
			that.getUserOpenId().then(data=>{
				app.globalData.unionId = data.unionid
				app.globalData.openId = data.openId
				app.globalData.nickName = data.nickName
				app.globalData.avatarUrl = data.avatarUrl
				app.globalData.cardId = data.cardId?data.cardId:''
				that.cardId = data.cardId?data.cardId:''
				if (that.cardId=='') {
					uni.navigateTo({
						url: 'pages/change'
					})
				}
				uni.setStorage({
					key: 'CARDID',
					data: that.cardId,
					success() {
						that.getCardInfo()
					}
				})
			})
		},
		onShow:function(){
			this.getCardInfo()
		},
		methods: {
			navaToChange () {
				uni.navigateTo({url:'/pages/change??target=user'})
			},
			getCardInfo(){
				let that = this
				return new Promise((resolve, reject) => {	
					uni.getStorage({
						key: 'CARDID',
						success: function (res) {
							if (res.data !='') {
								that.cardId = res.data
								app.globalData.cardId = res.data
								getCheckCardByNumber(res.data).then(res2=> {
									resolve(res2)
									if (res2.statusCode == 200 && res2.data.card_no!='') {
										app.globalData.carqdId = res2.data.card_no
										that.asyncSetting({
											ispName:res2.data.operator,
											docUrl:res2.data.use_doc_url,
											passwordExist:res2.data.password_exist,
											needUnbind:res2.data.need_unbind,
											certStatus: res2.data.cert_status,
											supportRecover:res2.data.support_recover,
											payMode: res2.data.pay_mode,
											needAuth: res2.data.need_auth,
											canTg: res2.data.can_tg,
											changeCard: res2.data.change_card,
											cardChgStu: res2.data.change_status
										})
										// this.updateBalanceBy(res.data)
										app.globalData.balance = res2.data.balance
										that.balance = res2.data.balance
										app.globalData.docUrl = res2.data.use_doc_url
										app.globalData.certStatus = res2.data.cert_status
										that.certStatus = res2.data.cert_status
										app.globalData.payMode = res2.data.pay_mode									
									}
									
								}).catch(err => {
									reject(err)
								})
							}
						}
					})
				})
			},
			navaToPage: function (path) {
				if (app.globalData.openId == ''){
					this.getUserOpenId().then(data=>{
						app.globalData.unionId = data.unionid
						app.globalData.openId = data.openId
						app.globalData.nickName = data.nickName
						app.globalData.avatarUrl = data.avatarUrl
					})
				}else {
					if (this.cardId == '') {
						if (path=='/pages/help') {						
							uni.switchTab({url:path})
						}else {
							uni.navigateTo({url:'/pages/change?target='+path})
						}					
					}else {
						// if (this.needAuth =='是' && app.globalData.certStatus =='未认证' && path !='/certification') {
						// 	uni.showToast({
						// 		title: '请先实名认证',
						// 		icon: 'none'
						// 	})
						// }else {
							uni.navigateTo({url:path})
						// }
					}		
				}
			},
			toHelp: function () {
				if (this.cardId=='') {
					// this.$alert('', '提示', {
					// 	confirmButtonText: '确定',
					// });
					uni.showToast({
						title:"请先绑定卡号",
						icon:'none'
					})
				}else if (this.docUrl=='') {
					uni.showToast({
						title:"此卡暂无使用说明",
						icon:'none'
					})
				}else {
					uni.navigateTo({url:'/pages/web-view'});
				}
			},
			...mapActions('userData',[
				'updateBalanceBy',
				'asyncItemShow'
			]),
			...mapActions([
				'asyncSetting',
				'getUserOpenId'
			])
		}
	}
</script>

<style>
.uni-container {
	padding: 8vw 4vw 0;
	background-color: #f4f4f4;
	background-position: top center;
	background-repeat: no-repeat;
	background-size: 100% auto;
	overflow: hidden;
}
.user-header {
	margin-top: 5.333333vw;
	text-align: center
}
.user-header p {
	color: #fff;
	font-size: 10.666667vw;
	line-height: 13.333333vw;
	text-align: center;
}
.avatar {
	width: 22.666667vw;
	height: 22.666667vw;
	display: block;
	margin: 0 auto;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}
.avatar img {
	max-width: 100%;
	max-height: 100%;
}
.user-info-group {
	border-radius: 1.333333vw;
	padding: 2.666667vw 0 2.666667vw;
	margin: 3.2vw 4vw 0;
	box-shadow: 6.5px 11.258px 68px 0px rgba(14, 5, 10, 0.09);
	background-color: #fff;
}
.user-info-title {
	font-size: 3.2vw;
	line-height: 4vw;
	color: #8d8d8d;
	text-align: center;
}
.user-card-id {
	width: 100%;
	color: #8d8d8d;
}
.user-card-chg {
	font-size: 3.2vw;
	line-height: 4vw;
	color: #4d80ee;
}
.user-card-chg i {
	padding-left: 0.8vw;
	font-size: 4vw;
	line-height: 4vw;
	color: #4d80ee;
	display: inline;
	vertical-align: middle;
}
.user-info-body {
	width:100%;
	padding: 2vw 0;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: stretch;
}
.user-info-item {
	flex: 1 auto;
	width: 50%;
	text-align: center;
}
.user-info-value {
	font-size: 4vw;
	color: #2d2d2d;
	text-align: center;
}
.user-info-key {
	font-size: 3.2vw;
	color: #999;
	text-align: center;
}
.color-unverify {
	color: #fc6563;
}
.color-verified {
	color: #67c23a;
}
.user-menu {
	margin: 3.2vw 4vw 4vw;
	background-color: #fff;
	border-radius: 1.333333vw;
	padding: 3.2vw 0 0;
	box-shadow: 6.5px 11.258px 68px 0px rgba(14, 5, 10, 0.09);
	background-color: #fff;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-wrap: wrap;
}
.user-menu .user-menu-item {
	flex: 0 0 14.266667vw;
	margin: 0 3.2vw 3.2vw;
}
.user-menu-icon {
	width: 14.266667vw;
	height: 14.266667vw;
	border-radius: 50%;
	overflow: hidden;
	background-repeat: no-repeat;
	background-size: 77.066667vw 72.533333vw;
	background-position: -16.2667vw -58.266667vw;
}
/* .user-menu .user-menu-item:nth-child(1) .user-menu-icon {
	background-position: -16.2667vw -58.266667vw;
} */
.user-menu .user-menu-item:nth-child(1) .user-menu-icon {
	background-position: 0rem -42vw;
}
.user-menu .user-menu-item:nth-child(2) .user-menu-icon {
	background-position: -16.266667vw -42vw;
}
.user-menu .user-menu-item:nth-child(3) .user-menu-icon {
	background-position: -32.533334vw -42vw;
}
.user-menu .user-menu-item:nth-child(4) .user-menu-icon {
	background-position: -62.8vw 0;
}
/* 依次减1 */
/* .user-menu .user-menu-item:nth-child(5) .user-menu-icon {
	background-position: -62.8vw -16.266667vw;
} */
.user-menu .user-menu-item:nth-child(5) .user-menu-icon {
	background-position: -62.8vw -16.266667vw;
}
.user-menu .user-menu-item:nth-child(6) .user-menu-icon {
	background-position: 0 -58.266667vw;
}
.user-menu .user-menu-item:nth-child(7) .user-menu-icon {
	background-position: -16.2667vw -58.266667vw;
}
.user-menu .user-menu-item:nth-child(8) .user-menu-icon {
	background-position: -62.8vw -32.533334vw;
}
.user-menu-text {
	font-size: 3.2vw;
	text-align: center;
}
.con-list {
	margin: 4vw -4vw 0;
	padding: 4vw 2vw;
	background-color: #fff;
	background-color: rgb(0, 122, 255);
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: stretch;
}
.con-list-item {
	font-size: 4vw;
	line-height: 5.333333vw;
	color: #fff;
}
.con-list-item span {
	padding: 0 2vw;
	font-size: 5.333333vw;
	line-height: 5.333333vw;
	color: #fff;
	vertical-align: middle;
}
.con-list-color2 {
	font-size: 3.2vw;
	line-height: 5.333333vw;
	color: #fff;
}
.btn-group {
	margin: 4vw auto;
}
.btn-primary {
	padding: 6px 12px;
	line-height: 18px;
	font-size: 3.2vw;
	border-radius: 1.333333vw;
	color: #fff;
	text-align: center;
	background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
	box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
}
</style>
