<template>
    <div class="container" :style="{backgroundImage:'url('+bg+')'}">
        <div class="cover"></div>
        <div class="form">
            <h1>设置支付密码</h1>
            <div class="form-control">
                <label for="phone" class="form-label">手机号</label>
                <div class="form-input">
                    <input type="number" id="phone" v-model="phone" @change="checkPhone" placeholder="输入11位手机号，仅用于找回支付密码">
                </div>
            </div>
            <div class="form-control form-valid-control">
                <label for="smsCode" class="form-label">验证码</label>
                <div class="form-input">
                    <input type="text" id="smsCode" v-model="smsCode" placeholder="输入收到的验证码" maxlength="8">
                </div>
                <dir class="form-input-btn">
                    <button type="button" class="input-group-btn btn-unable" v-if="isShowNumber" disabled>{{cntNum}}(S)后获取</button>
                    <button type="button" class="input-group-btn btn-primary" v-else @click="getSmsCode">获取验证码</button>
                </dir>
            </div>
            <div class="form-control">
                <label for="passwordF" class="form-label">密码</label>
                <div class="form-input">
                    <input type="password" id="passwordF" v-model="passwordF" placeholder="设置余额支付密码">
                </div>
            </div>
            <div class="form-control">
                <label for="passwordS" class="form-label">重复密码</label>
                <div class="form-input">
                    <input type="password" id="passwordS" v-model="passwordS" @change="check" placeholder="确认余额支付密码">
                </div>
            </div>
            <div class="form-control">
                <button type="button" class="form-btn btn-primary" @click="setPassword">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
import { setPayPassWord , getCodeByPhone } from '@/utils/ApiList.js'
import { mapState } from 'vuex'
import baseUrl from '@/utils/url.js'
const app =getApp()
export default {
    data() {
        return {
            bg:this.imgs.loginBg,
            account: '',
            passwordF:'',
            passwordS: '',
            phone: '',
            smsCode:'',
            cntNum:119,
            isShowNumber: false,
            timer:0,
			cardId: app.globalData.cardId									//卡号
            // open_id: window.localStorage.getItem('OPEN_ID') || ''       //openid
        }
    },
    mounted () {
        clearInterval(this.timer)
        this.timer=0;
    },
    methods: {
        setPassword: function() {
            let that = this
            if (that.cardId=='') {
                uni.navigateTo({url:'/pages/change'})
            }else {
                if (that.smsCode ==''){
					uni.showToast({
						title:'请输入验证码',
						icon:'none'
					})
                }else {
					uni.request({
						url: baseUrl+'wx/set_pay_password',
						data: {
							card_no: that.cardId,
							pay_password: that.passwordF,
							phone_number: that.phone,
							sms_code: that.smsCode
						},
						method:'POST',
						success:res=>{
							if (res.statusCode == 200) {
								uni.showToast({
									title: res.data.msg,
									icon:'none'
								})
								let t=setTimeout(()=>{
									uni.navigateBack()
									clearTimeout(t)
								},1000)
							}else {
								uni.showToast({
									title: res.errMsg,
									icon:'none'
								})
							}
						},
					})
                }
               
            }
        },
        checkPhone:function () {
            if (!(/^1[345678]\d{9}$/).test(this.phone)){
				uni.showToast({
					title:'手机号格式不正确',
					icon:'none'
				})
            }
        },
        getSmsCode: function () {
            if (this.phone=='') {
				uni.showToast({
					title:'请输入手机号',
					icon:'none'
				})
            }else {
                getCodeByPhone({
                    phone_number:this.phone
                }).then(res => {
                    if (res.data.code == 0) {
                        uni.showToast({
							title:'验证码发送成功',
							icon:'none'
						})
                        this.isShowNumber = true
                        this.timer = setInterval(this.cntNumDown,1000)
                    }
                })
            }
        },
        cntNumDown:function () {
            if (this.cntNum>0){
                this.cntNum-=1
            }else {
                this.cntNum=119 
                this.isShowNumber=false
                clearInterval(this.timer)
                this.timer = 0
            }            
        },
        check: function () {
            if (this.passwordS != this.passwordF) {
				uni.showToast({
					title:'两次输入不一致，请重新输入',
					icon:'none'
				})
            }
        }
    },
}
</script>
<style>
.el-message-box__wrapper {
    width: 100%;
}
.el-message-box {
    width: 80%;
    margin: 0 auto;
    z-index: 3000!important;
}
.v-modal {
    z-index: 30!important;
}
</style>
<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
    position: absolute;
}
.cover {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background-color: rgba(0,0,0,0.3);
}
h1 {
    margin-bottom: 4vw;
    font-size: 6vw;
    line-height: 1em;
    position: relative;
    color: #333;
    z-index: 30;
}
.form {
    width: 80vw;
    margin: 10vw;
    padding: 5vw;
    border-radius: 1.333334vw;
    background-color: white;
    position: relative;
    z-index: 30;
}
.form-control {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
}
.form-control + .form-control {
    margin-top: 4vw;
}
.form-label {
    width: 25%;
    flex: 1 0 25%;
    padding: 0 4vw 0 0;
    text-align: right;
    font-size: 3.2vw;
    line-height: 30px;
}
.form-input {
    width: 75%;
    flex: 3 0 75%;
}
.form-valid-control .form-input {
    width: 37.5%!important;    
    flex: 1 0 37.5%!important;
}
.form-valid-control .form-input-btn {
    width: 37.5%;
    flex: 1 0 37.5%;
}
.form-valid-control .btn-primary {
    padding: 6px 12px;
    line-height: 18px;
    font-size: 3.2vw;
    border-radius: 1.333333vw;
    color: #fff;
    text-align: center;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
}
.form-valid-control .btn-unable {
    padding: 6px 12px;
    line-height: 18px;
    font-size: 3.2vw;
    border-radius: 1.333333vw;
    color: #fff;
    text-align: center;
    background-color: #ccc; 
}
.form-input input {
    width: 100%;
    padding-left: 0.25em;
    line-height: 30px;
    border-radius: 1.333334vw;
    border: 1px solid #ddd;
}
.form-input input::placeholder {
    font-size: 2.8vw;
    color: #999;
}
.form-input input:focus {
    border-color: #4379ec;
    box-shadow: 0 0 0.4vw 0 #4379ec;
}
.form-btn {
    width: 40vw;
    display: block;
    background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
    box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    line-height: 9.6vw;
    font-size: 4vw;
    border-radius: 1.333333vw;
    color: #fff;
    text-align: center;
}
#smsCode {
	width: 8em;
	padding: 0 0.5em;
	font-size: 3.2vw;
	line-height: 8vw;
	color: #333;
}
</style>