<template>
    <div class="container">
        <div class="banner">
			<image style="width: 100vw; background-color: #eeeeee;" mode="widthFix" :src="bannerPath"/>
            <a href="http://cwtx.dh.cx/" class="banner-link">
                <em class="iconfont icon-dingdan"></em>
				<span>查询订单</span>
            </a>
        </div>            
        <div class="item-info">
            <div class="item-title">
                <span class="item-price">¥{{productInfo.price}}</span>
                <span class="item-name">{{productInfo.name}}</span>
            </div>
            <!-- <div class="item-tags">
                <div class="tags">
					<em class="iconfont icon-7day"></em>
					<span>7天无理由退货</span>
				</div>
                <div class="tags">
					<em class="iconfont icon-anquan"></em>
					<span>店铺已认证</span>
				</div>
            </div> -->
        </div>
        <div class="order-group">
            <div class="order-title">
                <span class="order-title-adorn"></span>
                <p class="order-title-text">订单信息</p>
                <span class="order-title-adorn"></span>
            </div>
            <div class="order-info">
                <div class="order-img">
                    <image style="width: 20vw; height: 20vw; background-color: #eeeeee;" mode="aspectFit" :src="cardImageUrl"/>
                </div>
                <div class="order-product-info">
                    <div class="order-product-name">{{productInfo.name}}</div>
                    <p class="order-product-price">
                        ￥{{productInfo.price}}
                        <!-- <span class="order-product-remain">库存 {{productInfo.remain}}</span> -->
                    </p>
                </div>
                
            </div>
            <div class="form">
                <div class="form-control">
                    <label class="form-label flex-1" for="preCardNo">原卡号</label>
                    <div class="form-input-group flex-3">
                        <input class="form-input" v-model="orderInfo.preCardNo" type="text" id="preCardNo" placeholder="请输入原卡号">
                    </div>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1" for="name">收货人</label>
                    <div class="form-input-group flex-3">
                        <input class="form-input" v-model="orderInfo.receiveName" type="text" id="name" placeholder="请输入收货人姓名">
                    </div>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1" for="phone">手机号</label>
                    <div class="form-input-group flex-3">
                        <input class="form-input" type="text" id="phone" v-model="orderInfo.phone" placeholder="请输入收货人手机号">
                    </div>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1" for="addr">选择城市</label>
                    <div class="form-input-group flex-3">
                        <!-- <input class="form-input" type="text" :value="orderInfo.addName" id="addr" readonly @click="showPick=true" /> -->
						<picker 
							mode="multiSelector"
							:value="[pIndex,cIndex,tIndex]"
							:range="[provinceList,cityList,countyList]"
							@change="pickerChange"
							@columnchange="columnchange">
							<view class="form-input">{{locationData}}</view>
						</picker>
                    </div>
                </div>
                <div class="form-control" style="margin-top: 1.6vw;">
                    <p class="form-content" style="margin-left: 24vw;font-size: 3.2vw;">※注: 云南、新疆、西藏、广西暂不发货</p>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1" for="detailaddr">详细地址</label>
                    <div class="form-input-group flex-3">
                        <textarea 
							class="form-input"
							type="text"
							id="detailaddr"
							:fixed='true'
							maxlength="50"
							v-model="orderInfo.addrDetail"
							placeholder="请输入详细地址">
                        </textarea>
                    </div>
                </div>
                <div class="form-control" style="margin-top: 1.6vw;">
                    <p class="form-content" style="margin-left: 24vw;font-size: 3.2vw;">※换卡规则：因特殊原因造成流量卡不能使用的，我司可为您免费更换新卡使用，您可以在收到新卡后，联系人工客服进行套餐以及余额转移，谢谢</p>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1">付款方式</label>
                    <div class="form-input-group flex-3 border-none">
                        <input class="form-input" type="text" value="免费包邮" disabled/>
                    </div>
                </div>
                <div class="form-control">
                    <label class="form-label flex-1" for="content">买家留言</label>
                    <div class="form-input-group flex-3">
                        <textarea 
							class="form-input"
							placeholder="选填：对快递等的特殊要求"
							:fixed='true'
							type="text"
							v-model="orderInfo.content"
							maxlength="50"
							id="content"></textarea>
                    </div>
                </div>
            </div>
        </div>        
        <div class="fixed-between foot-fix">
            <a href="javascript:void(0);" class="btn-pre" @click="submitOrder" v-if="this.cardChgStu == '未申请'">提交换卡</a>
            <a href="javascript:void(0);" class="btn-pre"  @click="showStatusTips" v-else>提交换卡</a>
        </div>
    </div>
</template>

<script>
import { mapState , mapActions } from 'vuex'
import cityList from '@/utils/city.js'
import url from '@/utils/url.js'
import { getCheckCardByNumber } from '@/utils/ApiList.js'
let app = getApp()
    export default {
        data() {
            return {
                bannerPath: require('@/static/cwtx/banner.png'),                
                cardImageUrl: require('@/static/cwtx/banner.png'),
                showPick: false,
                cardNo: '',
                productInfo: {
                    name: '移动流量卡换卡申请',
                    remain: '999+',
                    price: 0
                },
                orderInfo: {
                    receiveName: '',
                    preCardNo:app.globalData.cardId || '',
                    phone: '',
                    addName:'',
                    addrDetail: '',
                    num: 1,
                    content:'',
                    fare: 0
                },
                openID:'',
                headImgUrl: '',
                nickName: '',
                showImg: false,
                qrCodeImagePath: require('@/static/cwtx/qrcode.jpg'),
				pIndex: 19,
				cIndex: 4,
				tIndex: 1,
            }
        },
        computed: {
            ...mapState([
                'changeCard',
                'cardChgStu'
            ]),
			provinceList(){
				let arr = new Array()
				cityList.forEach(item=>{
					arr.push(item.name)
				})
				return arr
			},
			cityList(){
				let arr = new Array()
				cityList[this.pIndex].sub.forEach(item=>{
					arr.push(item.name)
				})
				return arr
			},
			countyList(){
				let arr = new Array()
				cityList[this.pIndex].sub[this.cIndex].sub.forEach(item=>{
					arr.push(item.name)
				})
				return arr
			},
			locationData() {
				return this.provinceList[this.pIndex] + ' ' + this.cityList[this.cIndex] + ' ' + this.countyList[this.tIndex]
			}
        },
        mounted () {
            this.checkCardInfo()
        },
        methods: {
            checkCardInfo(){
                getCheckCardByNumber(this.cardId).then(res => {
                    if (res.status == 200 && res.data.card_no!='') {
                        this.asyncSetting({
                            changeCard: res.data.change_card,
                            cardChgStu: res.data.change_status
                        })
                    }
                })
            },
			pickerChange(e){
				this.orderInfo.addName = this.locationData
			},
			columnchange(e){
				switch (e.detail.column){
					case 0:
						this.pIndex = e.detail.value
						break;
					case 1:
						this.cIndex = e.detail.value
						break;
					case 2:
						this.tIndex = e.detail.value
						break;
					default:
						break;
				}
			},
            showStatusTips(){
                uni.showModal({
					title: '提示',
					content: '该卡已经申请更换新卡，请勿重复提交'
				})
            },
            submitOrder(){
                let that = this
                if (!that.orderInfo.preCardNo || that.orderInfo.preCardNo == '') {
					uni.showToast({
						title: '请填写收原卡号',
						icon:'none'
					})
                    return 
                }
                if (!that.orderInfo.receiveName || that.orderInfo.receiveName == '') {
                    uni.showToast({
						title: '请先填写收货人姓名',
						icon:'none'
					})
                    return 
                }
                if (!that.orderInfo.phone || that.orderInfo.phone == '' || !(/^1\d{10}$/).test(that.orderInfo.phone)) {
                    uni.showToast({
						title: '请填写正确的收货人手机号',
						icon:'none'
					})
                    return 
                }
                let addr = that.orderInfo.addName+this.orderInfo.addrDetail
                if (addr == '') {
					uni.showToast({
						title: '请选择城市并填写详细地址',
						icon:'none'
					})
                    return 
                }
                if (this.cardChgStu == '已申请') {
                    //重复提交提示
                    uni.showModal({
                    	title: '提示',
                    	content: '该卡已经申请更换新卡，请勿重复提交'
                    })
					
                }else {
                    uni.request({
                    	url: url + 'wx/change_card',
						method: 'POST',
						header: {
							"content-type": 'application/json'
						},
						data: {
							name: that.orderInfo.receiveName,
							phone: that.orderInfo.phone,
							addr: that.orderInfo.addName+that.orderInfo.addrDetail,
							card_no: that.orderInfo.preCardNo,
							remark: that.orderInfo.content
						},
						success: res => {
							if (res.data.code==0){
								//成功提示
								uni.showModal({
									title: '提示',
									content: '提交成功，我们将在48小时内为您发货，收到卡后可联系人工客服转移原卡以及套餐',
									confirmText: '确定',
									success: action => {
										that.checkCardInfo()
									}
								})
							}
                        }
                    })
                }
            },
            ...mapActions([
                'asyncSetting'
            ])
        },
        components: {
        }
    }
</script>

<style scoped>
    .container {
        padding-bottom: 13.6vw;
    }
	.banner {
		height: auto;
	}
    .banner-link {
        position: fixed;
        top: 20vw;
        right: 0;
        width: 22VW;
        height: 7.2VW;
        background-image: -moz-linear-gradient(90deg, #fc760c 0%, #ec3c38 100%);
        background-image: -webkit-linear-gradient(90deg, #fc760c 0%, #ec3c38 100%);
        background-image: -ms-linear-gradient(90deg, #fc760c 0%, #ec3c38 100%);
        background-image: linear-gradient(90deg, #fc760c 0%, #ec3c38 100%);
        display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
        border-top-left-radius: 3.6VW;
        border-bottom-left-radius: 3.6VW;
        z-index: 1;
		color: #fff;
		box-sizing: border-box;
    }
	.banner-link span {		
		font-size: 2.4vw;
	}
    .banner-link > em {
        font-size: 4vw;
        line-height: 7.2VW;
        margin-left: 1.6vw;
        margin-right: 2vw;
    }
    .item-info .iconfont {
        color: #ee4a17;
        font-size: 4vw;
        padding-right: 1.333333vw;
        font-family: "iconfont" !important;
    }
    .item-info {
        padding: 0 4vw;
        border-bottom: 1px solid #f5f5f5;
    }
    .item-title {
        padding: 4vw 0 5.333333vw;
        text-align: left;
    }
    .item-price {
        font-size: 4.266667vw;
        line-height: 1em;
        color: #ee4a17;
        padding-right: 5.333333vw;
    }
    .item-name {
        font-size: 4.266667vw;
        line-height: 1em;
        color: #333333;
    }
    .item-tags {
        padding: 0 4vw 4vw 0;
        font-size: 4vw;
        color: #666666;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
	.tags {
		display: inline;
	}
    .tags + .tags {
        margin-left: 9.333333vw;
    }
    .tab-group {
        padding-top: 3.2vw;
    }
    .tab-bar {
        padding-bottom: 3.2vw;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .tab-bar li {
        margin: 0 3.2vw;
        padding: 1.2vw 0;
        font-size: 4vw;
        line-height: 1em;
        color: #666666;
    }
    .tab-bar li.active {
        font-size: 4vw;
        color: #333333;
        line-height: 1em;
        border-bottom: 2px solid #4578ed;
    }
    .content-tips {
        text-align: center;
    }
    .fixed-between {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }
    .foot-fix {
		width:100%;
        height: 13.6vw;
        flex-wrap: nowrap;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 2100;
        border-top: 1px solid #ddd;
    }
    .btn-mobile {
        flex: 2;
        color: #ee4a17;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    .icon-dianhua {
        padding-right: 0.5em;
    }
    .btn-pre {
        flex: 3;
        text-align: center;
        font-size: 4.266667vw;
        line-height: 13.333333vw;
        color: #fff;
        background-color: #ee4a17;
    }
    .order-group {
        margin: 0;
        padding: 0 4vw;
        background-color: #fff;
    }
    .order-title{
        height: 16vw;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .order-title-adorn {
        height: 1px;
        width: 3.2vw;
        background-color: #ee4a17;
    }
    .order-title-text {
        padding: 0 4vw;
        font-size: 4.266667vw;
        line-height: 1em;
        color: #333;
    }
    .order-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
    }
    .order-img {
        width: 20vw;
        height: 20vw;
        margin-right: 4vw;
		overflow: hidden;
		border-radius: 0.8vw;
        flex: none;
    }
    .order-product-info {
        flex: auto;
    }
    .order-product-name {
        font-size: 4.266667vw;
        line-height: 1em;
        color: #333;
        text-align: left;
    }
    .order-product-price {
        margin-top: 4vw;
        font-size: 5.333333vw;
        line-height: 1em;
        vertical-align: baseline;
        text-align: left;
        color: #ee4a17;
    }
    .order-product-remain {
        padding-left: 4vw;
        font-size: 3.466667vw;
        line-height: 1em;
        color: #999;
        vertical-align: baseline;
        display: inline-block;
    }
    .form {
       padding: 6vw 0; 
    }
    .form-control {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .form-control + .form-control {
        margin-top: 4vw;
    }
    .flex-between {
        justify-content: space-between!important;
    }
    .flex-1{
        flex: 1;
    }
    .flex-3{
        flex: 3;
    }
    .flex-no {
        flex: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .form-label {
        padding-top: 2.4vw; 
        font-size: 4.266667vw;
        line-height: 4.8vw;
        color: #333;
        text-align: left;
    }
    .form-input-group {
        padding: 1.6vw 0.5em;
        text-align: left;
		border: 1px solid #ddd;		
		border-radius: 0.8vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
    }
    .flex-between .form-input-group {
        text-align: right;
    }
    .form-input {
        font-size: 4vw;
		padding: 0 .5em;
        border-radius: 0.8vw;
		vertical-align: middle;
        transition: box-shadow 0.5s;
    }
    p.form-input {
        color: #ee4a17;
        text-align: right;
        border: none!important;
    }
    .input-numgrp .form-input {
        width: 3em;
        margin: 0.25em;
        padding: 1.6vw 0.25em;
        text-align: center;
    }
    .input-numgrp .btn {
        width: 1.5em;
        text-align: center;
        padding: 1.6vw 0.5em;
        background-color: #ccc;
    }
    .input-numgrp .active {
        color: #fff;
        background-color: #ee4a17;
    }
    .form-input:focus {
        box-shadow: 0 0 2px 0 #4379ec;
    }
    textarea.form-input {
		width: 62vw;
		height: 14vw;
        line-height: 1.2em;
    }
	.border-none {
		border: none;
	}
	.border-none {
		text-align: right;
	}
</style>