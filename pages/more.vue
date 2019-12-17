<template>
    <div class="uni-container">
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="item.id" @click="navagit(index)">
				<view class="item-icon">
					<image :src="item.icon" mode="aspectFill"></image>
				</view>
				<text 
					:selectable="true"
					space="emsp">{{item.text}}</text>
			</view>
		</view>
		<view class="qrcode-item" v-if="isShowImg">
			<image :src="picUrl" ></image>
		</view>
		<view class="vedio-item" v-if="isShowVideo">
			<video 
				id="myVideo"
				ref="myVideo"
				:src="videoUrl"
				:autoplay='true'
				@error="videoErrorCallback"
				controls></video>
		</view>
    </div> 
</template>

<script>
export default {
    data() {
        return {
			list:[{
				id: 1,
				icon: '../static/cwtx/Sim-Card.png',
				text: '领卡',
				type: 'link',
				linkUrl: 'https://shop42457083.youzan.com/v2/goods/3no2guxcdbzer'
			},
			{
				id: 2,
				icon: '../static/cwtx/course.png',
				type:'link',
				text: '开卡教程',
				linkUrl:'http://mp.weixin.qq.com/mp/video?__biz=Mzg3NTExOTA1OQ==&mid=100000733&sn=a2a10025dbf52a132b7f37f5ecc0f4ec&vid=wxv_1026500361130999809&idx=1&vidsn=8dfcfb92fb1a136120e71476a737a257&fromid=1&scene=18&xtrack=1&clicktime=1570777036#wechat_redirect'
			},
			{
				id: 3,
				icon: '../static/cwtx/contacts-line.png',
				text: '关于我们'
			},
			{
				id: 4,
				icon: '../static/cwtx/truck-line.png',
				type: 'link',
				text: '物流查询',
				linkUrl:'http://kd.dh.cx/f3a2b'
			},
			{
				id: 5,
				icon: '../static/cwtx/web.png',
				type: 'pic',
				text: '公众号'
			},
			{
				id:6,
				icon: '../static/cwtx/VIP.png',
				text: '全网VIP',
				type: 'link',
				linkUrl: 'https://bccji.com/p/A0bsura30xc'
			},
			{
				id:7,
				icon: '../static/cwtx/qa.png',
				text: '意见反馈',
				type: 'link',
				linkUrl: 'http://chuangwang.mikecrm.com/pnRHt0Z'
			}],
			picUrl: require('@/static/cwtx/publish-qrcode.jpg'),
			isShowImg: false,
			isShowVideo: false,
			videoUrl: '',
			videoContext: null
        }
    },
    mounted () {
        // let that = this
        // window.location.href=that.url
	},
	methods:{
		navagit(num) {
			let that = this
			let obj = this.list[num]
			switch (obj.type){
				case 'link':
					plus.runtime.openURL(obj.linkUrl)
					that.isShowImg = false
					that.isShowVedio = false
					break;
				case 'url':
					uni.navigateTo({
						url:obj.linkUrl
					})
					that.isShowImg = false
					that.isShowVedio = false
					break;
				case 'pic':
					that.isShowImg =true
					that.isShowVedio = false
					break;
				// case 'video':
				// 	that.isShowImg = false
				// 	that.isShowVideo = true
				// 	that.videoUrl = obj.linkUrl

				// 		this.videoContext = uni.createVideoContext('myVideo')
				// 		this.videoContext.play()
				// 	break;
				default:
					that.isShowImg = false
					that.isShowVedio = false
					break;
			}
			// if (obj.type=='link') {
			// 	plus.runtime.openURL(obj.linkUrl)
			// }
		},
		videoErrorCallback: function(e) {
			uni.showModal({
				content: e.target.errMsg,
				showCancel: false
			})
		},
	}
	
}
</script>

<style scoped>
	.list {
		padding: 4vw;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
	}
	.item {
		width: 23vw;
		padding: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.item-icon {
		width: 16vw;
		height: 16vw;		
		line-height: 16vw;
		border-radius: 1.6vw;
		background-color: #D9D9D9;
		box-sizing: border-box;
	}
	.item-icon image{
		max-width: 80%;
		max-height: 80%;
		display: inline-block;
		vertical-align: middle;
	}
	.item text {
		display: block;
		text-align: center;
	}
	.qrcode-item {
		width: 320rpx;
		height: 320rpx;
		margin: 0 auto;
		text-align: center;
	}
	.qrcode-item image {
		max-width: 100%;
		max-height: 100%;
		vertical-align: center;
	}
	.vedio-item {
		width: 100%!important;
		height: 1080rpx;
		margin: 0 auto;
		text-align: center;
	}
	.vedio-item video {
		max-width: 100%;
		height: 100%!important;
		display: inline-block;
		vertical-align: center;
	}
</style>