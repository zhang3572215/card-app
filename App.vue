<script>
	import baseUrl from '@/utils/url.js'
    export default {
		globalData: {  
			cardId: '',
			balance: 0,
			unionid:'',
			openId:'',
			nickName:'',
			avatarUrl:'',
			docUrl:'',
			payMode:'自定义金额',
			registrationID: '',
			certStatus: '未认证'
		},		
        onLaunch: function() {
            // #ifdef APP-PLUS
			// 锁定屏幕方向
            plus.screen.lockOrientation('portrait-primary'); //锁定
			
			// if(window.plus){  
				this.plusReady();  
			// }else{  
			// 	document.addEventListener('plusready',plusReady,false);  
			// }
			// 极光推送
			this.jyJPush.getAPPKey(result=> {
				//  会打印出自己配置的appkey和channel
				//console.log(JSON.stringify(result))
			});
			this.jyJPush.getRegistrationID(result=> {
				//  如果极光配置成功，则会返回正常数据，可以按照此项判断是否初始化成功
				//  返回的数据会有registrationID，errorCode
				this.$options.globalData.registrationID = result.registrationID
				//console.log(this.$options.globalData)
			});
			this.jyJPush.addJYJPushReceiveNotificationListener(result=> {
				//  监听成功后，若收到推送，会在result返回对应的数据；数据格式保持极光返回的安卓/iOS数据一致
				console.log(JSON.stringify(result))
			});
			this.jyJPush.addJYJPushReceiveOpenNotificationListener(result=> {
				//  监听成功后，若点击推送消息，会触发result；数据格式保持极光返回的安卓/iOS数据一致
				console.log(JSON.stringify(result))
			});
			// this.jyJPush.setJYJPushAlias({
			// 	//  按照自己的业务需求来设置
			// 	userAlias: '测试用户'
			// }, result=> {
			// 	//  设置成功或者失败，都会通过这个result回调返回数据；数据格式保持极光返回的安卓/iOS数据一致
			// 	//  注：若没有返回任何数据，考虑是否初始化完成
			// 	console.log(JSON.stringify(result))
			// });
			let t = setTimeout(this.getLastInfo,1000)
			
            var domModule = weex.requireModule('dom');
            domModule.addRule('fontFace', {
                'fontFamily': "uniicons",
                'src': "url('./static/uni.ttf')"
            });
            // #endif
        },
        onShow: function() {
            // console.log('App Show')
        },
        onHide: function() {
            // console.log('App Hide')
        },
		methods:{
			getLastInfo(){
				let that = this
				that.jyJPush.getLastPushInfo(result=> {
				    // console.log("lastPushInfo = " + JSON.stringify(result));
				    if (result.errorCode == 0) {
				        //  没有数据或者其他错误
				        return 0;
				    }
				    //  这里处理点击事件，和addJYJPushReceiveOpenNotificationListener方法的事件一直就行
				});
			},
			downLoadWgt:function(){
				//下载wgt文件...
				let that = this
				plus.nativeUI.showWaiting("下载wgt文件...");  
				plus.downloader.createDownload( "http://file.iot886.com/__UNI__9FCCC78.wgt", {filename:"_doc/update/"}, function(d,status){  
					if ( status == 200 ) {
						console.log("下载wgt成功："+d.filename);  
						that.installWgt(d.filename); // 安装wgt包  
					} else {  
						console.log("下载wgt失败！");  
						plus.nativeUI.alert("下载wgt失败！");  
					}  
					plus.nativeUI.closeWaiting();  
				}).start();  
			},
			installWgt:function(path){  
				//安装wgt文件...
				plus.nativeUI.showWaiting("安装wgt文件...");  
				plus.runtime.install(path,{},function(){  
					plus.nativeUI.closeWaiting();  
					console.log("安装wgt文件成功！");  
					plus.nativeUI.alert("应用资源更新完成！点击确认重启",function(){  
						plus.runtime.restart();  
					});  
				},function(e){  
					plus.nativeUI.closeWaiting();  
					console.log("安装wgt文件失败["+e.code+"]："+e.message);  
					plus.nativeUI.alert("安装wgt文件失败["+e.code+"]："+e.message);  
				});  
			},
			plusReady(){
				// ......  
				var wgtVer=null;
				let that = this
				
				// 获取本地应用资源版本号  
				plus.runtime.getProperty(plus.runtime.appid,function(inf){  
					wgtVer=inf.version;  
					console.log("当前应用版本："+wgtVer);
					// 检测升级
					uni.request({
					    url: baseUrl + 'wx/app_version', //检查更新的服务器地址
					    method: 'GET',
					    success: (res) => {
					        if (res.statusCode == 200 && res.data.code == 0) {
								// let openUrl = ''
								if (plus.os.name === 'iOS') {
									if (res.data.data.ios_v != wgtVer) {
										// openUrl = res.data.data.ios_addr
										that.downLoadWgt()
									}
								}else {
									if (res.data.data.android_v != wgtVer) {
										// openUrl = res.data.data.android_addr
										that.downLoadWgt()
									}
								} 
					            // 提醒用户更新
					    //         uni.showModal({
					    //             title: '更新提示',
					    //             content: res.data.note ? res.data.note : '是否选择更新',
									// showCancel: false,
					    //             success: (showResult) => {
					    //                 if (showResult.confirm) {
					                        // plus.runtime.openURL(openUrl);
											// 下载wgt文件  
											
					            //         }
					            //     }
					            // })
					        }
					    }
					})
				});  
			}
		}
    }
</script>

<style>
    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/uni.css';
	@import './common/common.css';
	@import './common/FontIcon.css';
	@import './common/font.css';
	
    /* 以下样式用于 hello uni-app 演示所需 */
    page {
        background-color: #F4F5F6;
        height: 100%;
        font-size: 28upx;
        line-height: 1.8;
    }

    .uni-header-logo {
        padding: 30upx;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10upx;
    }

    .uni-header-image {
        width: 100px;
        height: 100px;
    }

    .uni-hello-text {
        color: #7A7E83;
    }

    .uni-hello-addfile {
        text-align: center;
        line-height: 300upx;
        background: #FFF;
        padding: 50upx;
        margin-top: 10px;
        font-size: 38upx;
        color: #808080;
    }
	
    /* #endif*/
	.uni-tabbar__item + .uni-tabbar__item {
		border-left: 1px solid #ccc;
	}
</style>
