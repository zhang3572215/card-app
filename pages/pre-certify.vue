<template>
    <div class="container">
        <div class="title">友情提醒</div>
        <p class="p-title">特别提醒:</p>
        <p class="p-fline">点击确认后你将进入国政通实名系统。</p>
        <p>手机号码:你本人办理的能正常接收验证码的手机号码。
            <span>（虚拟运营商号段170 171 165没有对接国政通实名系统，无法实名）</span>
        </p>
        <p>姓名:必须是你本人的姓名。</p>
        <p>身份证号:必须是你本人的身份证号。</p>
        <p>若你填写错误，实名认证将失败！因国政通系统每调用一次就会产生调用费用，你只有一次免费实名认证机会，从第二次起每次都会收取1元的费用。</p>
        <div class="btn-group">
            <div class="btn" @click="toPost">确定</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        methods:{
            toPost(){
                uni.navigateTo({
                	url:'/pages/certification'
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        padding: 4vw;
        position: absolute;
        background-color: #f0ffff;
    }
    .title {
        padding: 3.2vw;
    }
    p {
        font-size: 4vw;
        line-height: 1.4em;
        color: #333;
    }
    .p-title {
        color: red;
    }
    .p-fline {
        color: #eeaeee;
        text-indent: 2em;
    }
    p > span {
        color: #cd5555;
    }
    .btn-group {
        padding: 8vw;
    }
    .btn{
        display: block;
        color: #fff;
        padding: 1.6vw;
		border-radius: 0.8vw;
		text-align: center;
        background: -moz-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
        background: -webkit-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
        background: -ms-linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
        background: linear-gradient(-10deg, #4379ec 0%, #759df4 100%);
        box-shadow: 0 0.8vw 1.6vw 0 #4379ec;
    }
</style>