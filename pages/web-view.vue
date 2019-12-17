<template>
	<view class="uni-container">
		<web-view
			:src="url"
			:progress="false"
			/>
	</view>	
</template>

<script>
	import { mapState } from 'vuex'
	const app = getApp()
	export default {
		data() {
			return {
				url: ''
			}
		},			
		computed:{		
			...mapState([
				'docUrl'
			])
		},	
		onShow: function(){
			this.url = app.globalData.docUrl
		},
		methods: {
			
		}
	}
</script>
	

<style>
</style>
