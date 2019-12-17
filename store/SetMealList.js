import { getProductListByNumber } from '@/utils/ApiList'
import imgs from '@/utils/image-path'
export default {
    namespaced: true,
    state: {
		clockIcon: imgs.clockIcon,
        productList:[]
    },
    mutations: {
      creatProductList (state, list) {
          state.productList = list
      },
    },
    actions: {
      updateProductListBy({ commit, state },cardNumer){
        getProductListByNumber(cardNumer).then(res => {
          if ( res.statusCode == 200) {
            commit('creatProductList',res.data.product_list)
          }          
        })
      }
    }
  }