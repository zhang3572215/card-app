(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/change"],{"0039":function(a,t,e){"use strict";(function(a){e("8602"),e("921b");n(e("66fd"));var t=n(e("42d0"));function n(a){return a&&a.__esModule?a:{default:a}}a(t.default)}).call(this,e("6e42")["createPage"])},"0120":function(a,t,e){},"071f":function(a,t,e){},"3aa7":function(a,t,e){"use strict";(function(a,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=e("d441"),r=c(e("ee6a")),d=e("2f62");function c(a){return a&&a.__esModule?a:{default:a}}function u(a){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{},n=Object.keys(e);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(e).filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.forEach(function(t){s(a,t,e[t])})}return a}function s(a,t,e){return t in a?Object.defineProperty(a,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):a[t]=e,a}var i=function(){return e.e("components/uni-popup/uni-popup").then(e.bind(null,"e3a6"))},l=getApp(),g={data:function(){return{logoImage:this.imgs.logoImg,bg:this.imgs.loginBg,card_id:l.globalData.cardId,target:""}},computed:u({},(0,d.mapState)(["openID"])),mounted:function(){},onLoad:function(a){"undefined"!=typeof a.target&&""!=a.target&&(this.target=a.target)},methods:u({updateCardId:function(a){l.globalData.cardId=a.detail.value,this.card_id=a.detail.value},confirmCard:function(){var t=this,e=this;(0,o.getCheckCardByNumber)(e.card_id).then(function(o){200==o.statusCode&&""!=o.data.card_no?(t.asyncSetting({ispName:o.data.operator,docUrl:o.data.use_doc_url,passwordExist:o.data.password_exist,needUnbind:o.data.need_unbind,certStatus:o.data.cert_status,supportRecover:o.data.support_recover,needAuth:o.data.need_auth,payMode:o.data.pay_mode,canTg:o.data.can_tg,changeCard:o.data.change_card,cardChgStu:o.data.change_status}),l.globalData.cardId=o.data.card_no,t.card_id=o.data.card_no,l.globalData.balance=o.data.balance,l.globalData.certStatus=o.data.cert_statu,l.globalData.payMode=o.data.pay_mode,l.globalData.docUrl=o.data.use_doc_url,a.request({url:r.default+"wx/bind_card_no",method:"POST",data:{open_id:l.globalData.openId,source:"app",card_no:o.data.card_no},complete:function(t){0!=t.data.code?a.request({url:r.default+"wx/app_user_info",method:"POST",data:{open_id:l.globalData.openId,union_id:l.globalData.unionId,nike_name:l.globalData.nickName,sex:"",city:"",province:"",country:"",head_img_url:l.globalData.avatarUrl},success:function(t){a.request({url:r.default+"wx/bind_card_no",method:"POST",data:{open_id:l.globalData.openId,source:"app",card_no:o.data.card_no},complete:function(t){console.log(n(t," at pages\\change.vue:113")),a.setStorage({key:"CARDID",data:o.data.card_no,success:function(){"undefined"!=typeof e.target&&""!=e.target?"user"==e.target?a.switchTab({url:"/pages/user"}):a.navigateTo({url:e.target}):a.switchTab({url:"/pages/user"})}})}})}}):a.setStorage({key:"CARDID",data:o.data.card_no,success:function(){"undefined"!=typeof e.target&&""!=e.target?"user"==e.target?a.switchTab({url:"/pages/user"}):a.navigateTo({url:e.target}):a.switchTab({url:"/pages/user"})}})}})):(l.globalData.cardId="",a.showToast({title:"你输入的卡号不正确，请重新输入",icon:"none"}))})},checkCard:function(){var t=this;(0,o.getCheckCardByNumber)(t.card_id).then(function(e){200==e.statusCode&&""!=e.data.card_no?t.setPageData(e.data):(l.globalData.cardId="",a.showToast({title:"你输入的卡号不正确，请重新输入",icon:"none"}))})},setPageData:function(t){this.asyncSetting({ispName:t.operator,docUrl:t.use_doc_url,passwordExist:t.password_exist,needUnbind:t.need_unbind,supportRecover:t.support_recover,payMode:t.pay_mode,canTg:t.can_tg}),l.globalData.cardId=t.card_no,this.card_id=t.card_no,a.setStorageSync("CARDID",t.card_no),l.globalData.balance=t.balance,l.globalData.certStatus=t.cert_statu,l.globalData.payMode=t.pay_mode},scanCodeBy:function(){var t=this;a.scanCode({scanType:"qrCode",success:function(a){var e=a.result.slice(a.result.indexOf("state")+6);t.card_id=e,l.globalData.cardId=e,t.checkCard()}})}},(0,d.mapActions)("userData",["updateBalanceBy"]),(0,d.mapActions)(["asyncSetting"])),components:{uniPopup:i}};t.default=g}).call(this,e("6e42")["default"],e("0de9")["default"])},"42d0":function(a,t,e){"use strict";e.r(t);var n=e("79d4"),o=e("b22b");for(var r in o)"default"!==r&&function(a){e.d(t,a,function(){return o[a]})}(r);e("5379"),e("ba4b");var d=e("2877"),c=Object(d["a"])(o["default"],n["a"],n["b"],!1,null,"82d33aca",null);t["default"]=c.exports},5379:function(a,t,e){"use strict";var n=e("071f"),o=e.n(n);o.a},"79d4":function(a,t,e){"use strict";var n=function(){var a=this,t=a.$createElement;a._self._c},o=[];e.d(t,"a",function(){return n}),e.d(t,"b",function(){return o})},b22b:function(a,t,e){"use strict";e.r(t);var n=e("3aa7"),o=e.n(n);for(var r in n)"default"!==r&&function(a){e.d(t,a,function(){return n[a]})}(r);t["default"]=o.a},ba4b:function(a,t,e){"use strict";var n=e("0120"),o=e.n(n);o.a}},[["0039","common/runtime","common/vendor"]]]);