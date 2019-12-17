<template>
    <div class="uni-container" :style="{backgroundImage:'url('+bgTop+')'}">
        <div class="flow-container">
            <div class="box" :style="{backgroundImage: 'url('+flowTopBg+')' }">
                <div class="type-img">
                    <img :src="ispName|operatorFilter" alt="">
                </div>
                <div class="desc">
                    <p>{{cardId}}</p>
                    <p>卡状态：<i>{{bindStatus}}</i></p>
                </div>
                <!-- <div class="flow-btn">
                    <button type="button">切换用户</button>
                </div> -->
            </div>
        </div>
        <div class="detail">
            <div class="top-list fn-clear">{{bindStatus|DiacrisisFilter}}</div>
        </div>   
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getDiacrisisResult, getCheckCardByNumber } from '@/utils/ApiList.js'
const app = getApp()
export default {
    data() {
        return {
            bg:this.imgs.loginBg,            
            statusContext:'',
            bindStatus: '未知',
			cardId: app.globalData.cardId
        }
    },
    computed: {
        ...mapState([
            'ispName'
        ]),
        ...mapState('flowData',[
            'bgTop',
            'flowTopBg',
        ]),
    },
    mounted () {
        if (this.cardId!='') {
			uni.showLoading({
				title:'加载中'
			})
            getDiacrisisResult({card_no:this.cardId}).then(res => {
                // console.log(res)
                this.bindStatus = res.data.card_status
				uni.hideLoading()
            }).catch(err => {
                this.bindStatus='未知'
				uni.hideLoading()
            })
        }        
    },
    methods: {        
		
    },
    components: {
        
    }
}
</script>
<style scoped>
.uni-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f5f5f5;
    background-position: top center;
    background-size: 100% auto;
    background-repeat: no-repeat;
}
.flow-container .box {
    margin: 28vw 4vw 0 4vw;    
    background-size: 100% auto;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: center right;
    border-radius: 1.333333vw;
    padding-bottom: 1vw; 
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
}
.type-img {
    width: 30vw;
	height: 32vw;
    flex: none;
    box-sizing: border-box;
    padding: 2.666667vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.type-img img {
	max-width: 100%;
	max-height: 100%;
}
.desc {
    min-width: 70%;
    margin-top: 2.666667vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
}
.desc p {
    text-align: left;
    font-size: 4vw;
    line-height: 5.333334vw;
    color: #666;
}
.desc p i {
    padding-left: 0.5em; 
    color: #4379ec;
	display: inline;
}
.detail {
    margin: 4vw 4vw 0;
    background: #fff;
    border-radius: 1.333333vw;
}
.top-list {
    padding: 4vw;
    text-align: left;
    font-size: 4vw;
    line-height: 5.333334vw;
    color: #666;
    text-indent: 2em;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
}
</style>