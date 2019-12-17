<template>
    <div class="uni-container" :style="{backgroundImage:'url('+bg+')'}">
        <div class="cover"></div>
        <h1>登录</h1>
        <div class="form-group">
            <div class="uni-flex uni-row">
                <div class="form-label flex-item">账号</div>
                <div class="form-input flex-item">
                    <input type="text" id="account" :value="account" @change="asyncSetting({account:$event.target.value})">
                </div>
            </div>
            <div class="uni-flex uni-row">
                <div class="form-label">密码</div>
                <div class="form-input">
                    <input type="password" id="passWord" v-model="passWord">
                </div>
            </div>
            <div class="uni-flex uni-row">
                <button type="button" class="form-btn btn-primary" @click="login">登录</button>
            </div>
			<div class="uni-flex uni-row" style="justify-content: center;text-align: center;">
			    <div class="wx-log-btn">
					<img :src="wxIcon" alt="微信图标">
				</div>
			</div>
        </div>
    </div>
</template>

<script>
import { postAccountDataBy } from '@/utils/ApiList.js'
import { mapState , mapActions } from 'vuex'
export default {
    data() {
        return {
            bg:this.imgs.loginBg,
            loginName: this.account,
            passWord:'',
			wxIcon: this.imgs.wxIcon
        }
    },
    computed: {
        ...mapState([
            'account'
        ])
    },
    mounted () {
        
    },
    methods: {
        login: function() {
            // console.log(this.account+':'+this.passWord)
        },
        ...mapActions([
            'asyncSetting'
        ])
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
    z-index: 40!important;
}
.v-modal {
    z-index: 30!important;
}
</style>
<style scoped>
.uni-container {
	height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: cover;
    position: relative;
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
    font-size: 6.4vw;
    position: relative;
    color: #fff;
    z-index: 30;
}
.form-group {
    width: 70vw;
    margin: 10vw 15vw;
    padding: 5vw;
    border-radius: 1.333334vw;
    background-color: white;
    position: relative;
    z-index: 30;
}
.uni-flex {
    width: 100%;
	justify-content: center;
	align-items: center;
}
.uni-flex + .uni-flex {
    margin-top: 4vw;
}
.form-label {
	
    padding: 0 4vw 0 0;
    text-align: left;	
    font-size: 3.2vw;
    line-height: 8vw;
}
.form-input input {
    width: 100%;
    height: 8vw;
    padding-left: 0.5em; 
    border-radius: 1.333334vw;
    border: 1px solid #ddd;
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
    display: block;
}
.wx-log-btn {
	width: 8vw;
	height: 8vw;
	margin: 0 auto;
	flex: none;
	border-radius: 50%;
	text-align: center;
}
.wx-log-btn img {
	max-width: 100%;
	max-height: 100%;
	display: inline-block;
	vertical-align: middle;
}
</style>