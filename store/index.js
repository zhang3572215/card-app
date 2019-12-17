import Vue from 'vue'
import Vuex from 'vuex'
import baseUrl from '@/utils/url'
import UserData from './UserData.js'
// import WalletData from './WalletData'
import RechargeData from './RechargeData'
import SetMealList from './SetMealList'
import ConfirmData from './ConfirmData.js'
// import RecoverData from './recoverData' 
import FlowData from './flowData'
import RecorderData from './RecorderData.js'
import Activity from './Activity.js'
import HomeData from './HomeData'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// cardId: '',									//window.localStorage.getItem('CARD_ID')||'',
		openID: '',
		unionId: '',
		nickName: '',
		headImgUrl: '',
		helpUrl:'',
		isPasswordExsit: 0,
		ispName:'',
		docUrl:'',
		passwordExist:false,
		account:'123',
		isBind:0,                                                         //微信绑定
		needAuth: '是',                                                   //是否实名认证
		needUnbind: '有',                                                 //是否否已机卡绑定
		certStatus: '未认证',
		supportRecover: '支持',                                           //是否支持恢复上网功能
		payMode:'直付模式',     //支付方式
		hasLogin: false,
		loginProvider: null,
		canTg: '不能推广',
		changeCard: '',
		cardChgStu: ''
	},
	getters:{
		getHeadImgUrl: state => {
			return state.userData.avatar?state.userData.avatar:''
		},
		getNickName: state => {
			return state.userData.name?state.userData.name:''
		}
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setUnionId(state, unionId) {
			state.unionId = unionId
		},
		syncSetting (state,obj) {
			Object.assign(state,obj)
		},
		syncIsPayAuth (state) {
			state.isPayAuth = true
		}
	},
	actions: {
		asyncSetting({ commit, state },data) {
			commit('syncSetting',data)
		},
		// lazy loading openid
		getUserOpenId: async function ({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {				
				uni.getStorage({
					key: 'UNIONID',
					success: res => {
						commit('syncSetting',{
							unionId: res.data,
							openID:uni.getStorageSync('OPENID'),
							headImgUrl:uni.getStorageSync('AVATARURL'),
							nickName:uni.getStorageSync('NICKNAME')
						})
						uni.getStorage({
							key: 'CARDID',
							complete: function (resData){
								resolve({
									unionid: res.data,
									openId:uni.getStorageSync('OPENID'),
									avatarUrl:uni.getStorageSync('AVATARURL'),
									nickName:uni.getStorageSync('NICKNAME'),
									cardId: resData.data?resData.data:''
								})
							},
						})
						
					},
					fail: ()=>{
						uni.getProvider({
							service: 'oauth',
							success: function (res){
								if (~res.provider.indexOf('weixin')) {
									uni.login({
										provider:'weixin',
										success: (data) => {
											commit('login')
											uni.getUserInfo({
											  provider: 'weixin',
											  success: function (infoRes) {
												commit('syncSetting',{
													openID: infoRes.userInfo.openId,
													nickName: infoRes.userInfo.nickName,
													headImgUrl: infoRes.userInfo.avatarUrl
												})
												uni.setStorage({
													key: 'OPENID',
													data: infoRes.userInfo.openId,
													success() {
														uni.request({
															url:baseUrl + 'wx/app_user_info',
															method: 'POST',
															data: {
																open_id: infoRes.userInfo.openId,
																union_id: infoRes.userInfo.unionId,
																nike_name: infoRes.userInfo.nickName,
																sex: infoRes.userInfo.gender,
																city: infoRes.userInfo.city,
																province: infoRes.userInfo.province,
																country: infoRes.userInfo.country,
																head_img_url:infoRes.userInfo.avatarUrl
															},
															success: resData=>{
																if (typeof(resData.data.data.card_no) != 'undefined' && resData.data.data.card_no !='') {
																	resolve({
																		unionid: infoRes.userInfo.unionid,
																		openId: infoRes.userInfo.openId,
																		avatarUrl: infoRes.userInfo.avatarUrl,
																		nickName: infoRes.userInfo.nickName,
																		cardId: resData.data.data.card_no
																	})
																}else {
																	resolve({
																		unionid: infoRes.userInfo.unionid,
																		openId: infoRes.userInfo.openId,
																		avatarUrl: infoRes.userInfo.avatarUrl,
																		nickName: infoRes.userInfo.nickName
																	})
																}
															},
															fail: err => {
																console.log(err)
															}
														})
													}
												})
												uni.setStorage({
													key: 'NICKNAME',
													data: infoRes.userInfo.nickName
												})
												uni.setStorage({
													key: 'AVATARURL',
													data: infoRes.userInfo.avatarUrl
												})
												uni.setStorage({
													key: 'UNIONID',
													data: infoRes.userInfo.unionId
												})
											  }
											})							 
										},
										fail: (err) => {
											console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
											reject(err)
										}
									})
								}
							}
						})
					}
				})
			})
		}
	},
	modules:{
		userData:UserData,
		confirmData:ConfirmData,
		recorderData:RecorderData,
		flowData:FlowData,
		setMealList: SetMealList,
		rechargeData: RechargeData,
		activityData: Activity,
		homeData:HomeData
	}
})

export default store
