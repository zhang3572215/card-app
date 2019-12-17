
import images from '../utils/image-path'
export default {
    namespaced: true,
    state: {
      bgTop: images.userBgTop,
      avatar: images.avatar,
	  name:'蘧蘧然',
      icons: images.icons,
      menuList: [ /*{
        id: 1,
        text: '我的钱包',
        path:'/wallet'
      } ,*/{
        id: 2,
        text: '余额充值',
        path:'/pages/confirm',
		isShow: true
      },{
        id: 3,
        text: '套餐订购',
        path: '/pages/set-meals',
		isShow: true
      },{
        id: 4,
        text: '流量查询',
        path:'/pages/flow',
		isShow: true
      },{
        id: 5,
        text: '消费记录',
        path:'/pages/recorder',
		isShow: true
      },{
        id: 7,
        text: '智能诊断',
        path:'/pages/diacrisis',
		isShow: true
      },{
        id: 8,
        text: '恢复上网',
        path:'/pages/recover',
		isShow: false
      },{
        id: 9,
        text: '免费流量',
        path:'/pages/activity'  
      // },{
      //   id: 10,
      //   text: '客服',
      //   path: '/pages/help'
      },{
        id: 6,
        text: '实名认证',
        path:'/pages/pre-certify'
      }],
      balance: 0.00,
      cert_status: 0
    },
    mutations: {
      balanceStatus (state, data1,data2) {
        state.balance = data1        
        state.cert_status = data2
      }
    },
	getters: {
		menuListFilter(state, getters, rootState) {                             //测出用到了rootState 注意区分和state区别
			let arr = new Array()
			state.menuList.forEach(element => {
				switch (element.text) {
				  case '恢复上网':
					arr.push(
						Object.assign(element,{
							isShow: rootState.supportRecover=='支持',
						})
					)
					break;
				  case '免费流量':
					arr.push(
						Object.assign(element,{
							isShow: rootState.can_tg=='能推广',
						})
					)
					break;
				  case '余额充值':
					arr.push(
						Object.assign(element,{
							isShow: rootState.payMode != '直付模式',
						})
					)
					break;
				  case '实名认证':
					arr.push(
						Object.assign(element,{
							isShow: rootState.needAuth=='是' && rootState.certStatus == '未认证'//,true,
  						})
					)
					break;
				  default:
					arr.push(
						Object.assign(element,{
							isShow: true,
						})
					)
					break;
				}
			});		
			return arr
		}
	},
    actions: {
      updateBalanceBy({ commit, state },data){
        let obj = {
          balance: state.balance,
          cert_status: state.cert_status
        }        
        Object.assign(obj,data)
        commit('balanceStatus',obj.balance,obj.cert_status)
      }
    }
  }