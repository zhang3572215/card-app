import images from '@/utils/image-path'
import { getRemainBy } from '@/utils/ApiList'
export default {
    namespaced: true,
    state: {      
      bgTop: images.rachargeBg,
      logoImage: images.yidongImage,
      flowTopBg:images.confirmTopBg,
      flowBottomImg: images.flowBottomImg,
      remainData:{
        end_time:"",
        remain:0,
        status:"已停用",
        total:0,
        used:0 
      }
    },
    mutations: {
      syncRemainData(state, data) {
        state.remainData = data
      },
    },
    actions: {
      updateRemainData ({ commit, state },card_num) {
        getRemainBy({card_no:card_num}).then(res => {
			console.log(res)
          if (res.statusCode==200){
            commit('syncRemainData',res.data)
          }
        })
      }
    }
  }