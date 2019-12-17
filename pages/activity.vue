<template>
    <div class="container" style="background-image: url(../static/cwtx/activity-bg.png);">
        <div class="top">
            <div class="top-left">
                <!-- <p class="user-sign">个性签名</p> -->
                <p class="nick-name">{{nickName}}</p>
            </div>
            <div class="top-right">
                <div class="avatar">
                    <img :src="headImgUrl" alt="">
                </div>
            </div>            
        </div>
        <div class="float">
            <p class="float-title">流量卡号</p>
            <p class="card-no">{{cardId}}</p>
        </div>
        <div class="conlist">
            <div class="con-item">
                <div class="item-left">
                    <span class="list-style"></span>
                    <p class="list-title">已邀请人数</p>
                </div>
                <p class="item-right">{{conlist.invite_count}} 人</p>
            </div>
            <div  class="con-item">
                <div class="item-left">
                    <span class="list-style"></span>
                    <p class="list-title">已获得流量</p>
                </div>
                <p class="item-right">{{conlist.total_bonus}} G</p>
            </div>
             <div  class="con-item">
                <div class="item-left">
                    <span class="list-style"></span>
                    <p class="list-title">可用流量</p>
                </div>
                <p class="item-right">{{conlist.remain_bonus}} G</p>
            </div>
            <div  class="con-item">
                <div class="item-left">
                    <span class="list-style"></span>
                    <p class="list-title">您的邀请链接</p>
                    <span class="list-link">http://front.iot886.com/receive?card_no={{cardId}}</span>
                </div>
                <div
                    class="item-btn"
					@click="onCopyRes('http://front.iot886.com/receive?card_no='+cardId);"
                    >复制</div>
            </div>
        </div>
        <div class="tips">
            <div class="tips-title">邀请送流量规则</div>
            <p>
                全民免费赢流量，活动期间：每邀请一位好友下单领卡可获得10G流量，满足流量包之后即可免费兑换流量包，每月邀请10人领卡，终身免费上网，赶紧行动吧！
            </p>
        </div>
        <div class="convert-group">
            <div class="convert-tips">可兑换流量包（您可满足条件后选择下面的流量包兑换）</div>
            <div class="progress-list">
                <div v-for="(item,index) in progressList" :key="index" class="progress-item" style="background-image: url('../static/cwtx/linebj.png')">
                    <div class="progress-item-left">
                        <p>{{item.product_name}}</p>
                        <!-- <el-progress 
                            :percentage="item.data/2"
                            :show-text="false"
                            :color="customColors"/> -->
                    </div>
                    <div class="min-btn btn-primary" @click="toExchange(index)">兑换</div>
                </div>
            </div>
        </div>
        <div class="btn-group">
            <div 
                class="btn-primary"
                @click="onCopyRes('http://front.iot886.com/receive?card_no='+cardId);">点击复制邀请链接，免费拿流量</div>
        </div>
<!--        <el-dialog
            class="exchange-modal"
            title="提示"
            :visible.sync="dialogVisible"
            width="80%">
            <span>兑换将消耗一定量的可兑换流量，你确定要兑换码？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmExchange">确 定</el-button>
            </span>
        </el-dialog> -->
        <uni-popup
        	ref="selectNextPopup"
        	type="center"
        	inStyle="width:80%;border-radius: 1.6vw;">
        	 <div class="main-box fn-clear">
        		<div class="fl">
        			<div class="time-img">
        				<img :src="clockIcon" alt="">
        			</div>
        			<p class="txt">
        			请选择生效时间
        			</p>
        		</div>
        		<div class="fl">
        			<div class="icon-person" style="background-image: url('../static/cwtx/sprite.png');"></div>
        		</div>
        	</div>
        	<div class="dialog-btn-group">
        		<div :class="timeSuer==0?'btn sure':'btn'" @click="timeSuer=0">立即生效(本月)</div>
        		<div :class="timeSuer==1?'btn sure':'btn'" @click="timeSuer=1">次月生效(下月)</div>
        	</div>
        	<div class="dialog-footer">
        		<button type="button" class="btn btn-blue" @click="confirmExchange(timeSuer)">确认</button>
        	</div>
        </uni-popup>
    </div>
</template>

<script>
import { mapState , mapActions } from 'vuex'
import baseUrl from '@/utils/url.js'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
import clipboard from "@/common/dc-clipboard/clipboard"
const app = getApp()
    export default {
        data() {
            return {
                productIndex: -1,
                timeSuer: 0,
				cardId: app.globalData.cardId,
                dialogVisible: false,       //是否显示兑换提示对话框
            }
        },
        computed: {
            ...mapState([
                'nickName',
                'headImgUrl',
                'openID'
            ]),
			...mapState('setMealList',[
			  'clockIcon'
			]),
            ...mapState('activityData',[
                'customColors',
                'conlist',
                'progressList'
            ])
        },
        mounted () {
			this.asyncConlist(this.cardId)
			this.asyncProgressList(this.cardId)
        },
        methods: {
            onCopyRes(data){
				clipboard.setText(data)
				uni.showToast({
					title:"地址复制成功",
					icon:'none'
				})
            },
            toExchange(num){
                this.productIndex = num
				// uni.showModal({
				// 	title: '提示',
				// 	content: '兑换将消耗一定量的可兑换流量，你确定要兑换码？',
				// 	icon: 'none',
				// 	success: res => {
						// if (res.confirm) {							
							if (this.progressList[num].allow_next_month == '允许') {
							    this.$refs.selectNextPopup.open()
							}else {
								this.confirmExchange(0)
							}
						// }
				// 	}
				// })
            },
            confirmExchange(timeSuer){
                this.dialogVisible = false
                uni.request({
                	url: baseUrl + 'wx/exchange_product',
					method: 'POST',
					data:{
					   product_id: this.progressList[this.productIndex].product_id,
					   card_no: this.cardId,
					   effect_type: timeSuer
					},
					success:res => {
						if (res.data.code ==0) {
							uni.showToast({
								title:"兑换成功",
								icon:'none',
								success: () => {
									this.$refs.selectNextPopup.close()
								}
							})
						}else {
							uni.showToast({
								title:"兑换失败：" + res.data.msg,
								icon:'none',
								success: () => {
									this.$refs.selectNextPopup.close()
								}
							})
						}
					}            
                })   
            }, 
            confirmMeal () {
                this.selectVisible=false
                this.dialogVisible=true             
            },
            ...mapActions('activityData',[
                'asyncConlist',
                'asyncProgressList'
            ])
        },
		components: {
		  uniPopup
		}
    }
</script>
<style>
.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	width: 90vw;
}
</style>
<style scoped>
    .container {
        width: 100%;
        min-height: 200vw;
/*        background-image: url('../static/cwtx/activity-bg.png'); */
        background-size: 100% auto;
        background-position: 0 -24vw;
        background-repeat: no-repeat;
        background-color: #e9eaef;
    }
    .top {
        padding: 11.733333vw 4vw 5.866666vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }
    .top-left {
        height: 17.333333vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
    .user-sign {
        font-size: 3.2vw;
        color: #fff;
        line-height: 1em;
    }
    .nick-name {
        font-size: 8vw;
        line-height: 1em;
        color: #fff;
    }
    .top-right {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
    }
    .avatar {
        width: 14.4vw;
        height: 14.4vw;
        text-align: center;
        border-radius: 50%;
        border: 2px solid #fff;
        overflow: hidden;
    }
    .avatar img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
    }
    .float {
        margin: 0 4vw 4.8vw;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 1.6vw;
        box-shadow: 0 0 3px 1px #ccc;
    }
    .float-title {
        padding-top: 7.46667vw;
        text-align: center;
        font-size: 4.26667vw;
        line-height: 1em;
        color: #4578ed;
        padding-bottom: 5.6vw;
    }
    .card-no {
        font-size: 6.4vw;
        line-height: 1em;
        color: #4578ed;
        text-align: center;
        font-weight: bold;
        padding-bottom: 9.2vw;
    }
    .conlist .con-item {
        padding: 2.666667vw 4vw 2.666667vw 0;
        background-color: #fff;
        display: flex;
        flex-basis: row;
        justify-content: space-between;
        align-items: center;
    }
   .conlist .con-item + .con-item {
        border-top: 1px solid #efeff2;
   }  
    .item-left {
        flex: auto;
        display: flex;
        flex-basis: row;
        justify-content: flex-start;
        align-items: center;
    }
    .list-style {
        height: 6.4vw;
        width: 1.066667vw;
        margin-right: 3.2vw;
        display: inline-block;
        border-top: 0.4vw solid transparent;
        border-bottom: 0.4vw solid transparent;
        border-left: 1.066667vw solid #4578ed;
    }
    .list-title {
        font-size: 4vw;
        line-height: 6.4vw;
        color: #333;
    }
    .list-link {
        width: 44vw;
        padding-left: 6.4vw;
        font-size: 3.2vw;
        line-height: 3.2vw;
        color: #333;
        white-space:nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .item-right {
        font-size: 4vw;
        line-height: 6.4vw;
        color: #333;
        text-align: right;
    }
    .item-btn {
        padding: 1.333333vw 4vw;
        font-size: 3.2vw;
        line-height: 1em;
        border: 1px solid #ccc;
        color: #333;
        background: #f4f4f4;
        border-radius: 0.8vw;
        display: inline-block;
        cursor: pointer;
    }
    .tips {
        margin-top: 1.333333vw;
        background-color: #fff;
    }
    .tips-title {
        font-size: 4vw;
        line-height: 11.733333vw;
		text-align: center;
        color: #4578ed;
    }
    .tips p {
        padding: 0 4vw;
        text-indent: 4vw;
        padding-bottom: 4.666667vw;
        color: #333;
        font-size: 3.733333vw;
        line-height: 5.333333vw;
        text-align: justify;
        font-size: 3.733333vw;
    }
    .convert-group {
        margin-top: 2.666667vw;
        background-color: #fff;
    }
    .convert-tips {
        font-size: 3.733333vw;
        color: #333;
		text-align:center;
        line-height: 11.466667vw;
        white-space: nowrap;
    }
    .progress-list {
        padding: 3.733333vw 4vw;
    }
    .progress-list .progress-item {
        height: 13.6vw;
        padding: 0 4vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 1.333333vw;
        /* background-image: url('@/static/cwtx/linebj.png');*/
        background-size: cover;
    }
    .progress-list .progress-item + .progress-item {
        margin-top: 2.666667vw;
    }
    .progress-item-left {
        height: 100%;
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
    }
    .progress-item-left > p {
        /* margin-bottom: 2.666667vw; */
        font-size: 3.733333vw;
        color: #fff;
        line-height: 1em;
        text-align: left;
    }
    .progress-list .progress-item .min-btn {
        flex: none;
        margin-left: 12vw;
        background: #83a6f8;
        font-size: 4vw;
        line-height: 7.733333vw;
        height: 7.733333vw;
        border-radius: 0.8vw;
        padding: 0 4vw;
        color: #fff;
    }
    .btn-group {
        background: #fff;
        padding: 1.333333vw 4vw 5.733333vw;
    }
    .btn-group .btn-primary {
        background: #4578ed;
        color: #fff;
        font-size: 4vw;
        line-height: 10.933333vw;
        display: block;
		text-align: center;
        border-radius: 0.8vw;
    }
    /**  复制选择套餐页面弹窗  **/
    
    .dialog-content .iconfont {
        display: block;
        margin: auto;
        text-align: center;
        font-size: 12vw;
    	line-height: 16vw;
        color: #ff0000;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .dialog-content .tit {
        color: #333;
        line-height: 8vw;
        font-size: 3.2vwz;
        border: none;
        
    }
    .dialog-content p {
        text-align: center;
    }
    .btn-red {
        width: 26.666667vw;
        display: block;
        margin: 4vw auto;
        background: #e61a1a;
        color: #fff;
        font-size: 3.2vw;
        height: 6.666667vw;
        line-height: 6.666667vw;
    }
    .main-box {
        padding: 4vw;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
    }
    .fl {
        width: 50%;
        flex: 1;
        display: block;
    }
    .time-img{
        width: 8vw;
        height: 8vw;
        display: block;
    	margin: 0;
    	border-radius: 50%;
    	overflow: hidden;
    }
    .main-box .fl .txt {
        color: #333;
        font-size: 4.266667vw;
        line-height: 10.666667vw;
    }
    .fl .icon-person {
        width: 25.6vw;
        height: 21.733333vw;
        display: block;
    	float: right;
        background-size: 77.066667vw 72.533333vw!important;
    	background-repeat: no-repeat;
    	background-position: 0 0;
    }
    .dialog-btn-group {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .dialog-btn-group li  {
        width: 50%;
        flex: 1;
        margin: 0 4vw;
    }
    .dialog-btn-group .btn {
        flex-grow: 1;
        padding: 0;
        border: 1px solid #ccc;
        border-radius: 1.333333vw;
        margin: 0 2.666667vw;
        line-height: 8vw;
        font-size: 3.2vw;
        color: #ccc;
    }
    .dialog-btn-group .sure {
        border-color: #4379ec;
        color: #4379ec;
    } 
    .btn-blue {
        width: 26.66667vw;
        padding: 0;
        display: inline-block;
        margin: 4vw;
        background: #4379ec;
        border-radius: 1.333333vw;
        color: #fff;
        font-size: 3.2vw;
        height: 6.66666vw;
        line-height: 6.66666vw;
    }
</style>