import { getInviteDate, getExchangeDate } from '@/utils/ApiList'
export default {
    namespaced: true,
    state: {
      progressList:[{
        id: 1,
        name: '30G流量包',
        percent: 30
      },{
        id: 2,
        name: '50G流量包',
        percent: 50
      },{
        id: 3,
        name: '80G流量包',
        percent: 80
      }],
      conlist: {
        invite_count: 0,
        remain_bonus: 0,
        total_bonus: 0
      },
      customColors:[
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    },
    mutations: {
      syncConlist(state, data){
        state.conlist = data
      },
      syncProgressList(state, list){
        state.progressList = list
      },
    },
    actions: {
      asyncConlist({ commit, state },cardNo){
        getInviteDate(cardNo).then(res => {
		  console.log(res)
          if (res.statusCode == 200) {
            commit('syncConlist',res.data)
          }
        })
      },
      asyncProgressList({ commit, state },cardNo){
        getExchangeDate(cardNo).then(res => {
          console.log(res)
          if (res.statusCode == 200) {            
            commit('syncProgressList',res.data.product_list)
          }
        })
      }
    }
  }