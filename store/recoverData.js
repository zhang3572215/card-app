import images from '../static/image-path'
export default {
    namespaced: true,
    state: {
      navaInfo:{
        navaTitle: '恢复上网',
        haveJump:false,
        rightLink:'',
        linkText:'',
      },
      logoImage: images.yidongImage,
      confirmTopBg:images.confirmTopBg,
      tableData:[{
        type: '恢复',
        date: '02-28 01:32',
        source:'后台操作'
      },{
        type: '停机',
        date: '02-28 01:32',
        source:'未订购次月套餐停机'
      }]
    },
    mutations: {
      
    },
    actions: {
      
    }
  }