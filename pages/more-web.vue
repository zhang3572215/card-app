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
	export default {
		data() {
			return {
				url:""
			}
		},
		onLoad:function(options){
			this.url = options['link-url']
		},
		mounted(){

		},
		methods: {
			
		}
	}
</script>
	

<style>
</style>
