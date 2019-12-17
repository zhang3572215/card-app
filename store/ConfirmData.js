import images from '@/utils/image-path'
export default {
    namespaced: true,
    state: {
      navaInfo:{
        navaTitle: '余额充值',
        haveJump:false,
        rightLink:'',
        linkText:'',
      },
      bgTop: images.rachargeBg,
      logoImage: images.yidongImage,
      confirmTopBg:images.confirmTopBg,
      confirmBottomBg: images.confirmBottomBg,
      amountList: [{
        id: 1,
        value: 30,
        extra: 0
      },{
        id: 2,
        value: 50,
        extra: 0
      },{
        id: 3,
        value: 100,
        extra: 5
      },{
        id: 4,
        value: 200,
        extra: 10
      }]
    },
    mutations: {
      
    },
    actions: {
     
    }
  }