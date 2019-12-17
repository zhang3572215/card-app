import api from '@/utils/request.js'
/**
 * api地址
 */

// export function getIndexData() {
//   return api({url:'api/api/index',method:'get'})
// }
//获取openid api
export function getOpenIdBy(data) {
  return api({url:'wx/access_token_openid',method:'get',data:data})
}
//获取openid （静默授权）
export function getOpenIdByCode(data) {
  return api({url:'/wx/get_open_id_by_code',method:'get',data:data})
}
//查询卡号是否正确
export function getCheckCardByNumber(number) {
  return api({url:'wx/card_info',method:'get',data:{card_no:number}})
}
//卡号可以购买的套餐列表
export function getProductListByNumber(number) {
  return api({url:'wx/product_list',method:'get',data:{card_no:number}})
}
//支付 api--(APP直接支付用)
export function getPayDataByWx(data) {
  return api({url:'wx/product_pre_pay_app',method:'get',data:data})
}
//支付 api--(充值余额用)
export function getRechargePayBy(data) {
  return api({url:'wx/balance_pre_pay_app',method:'get',data:data})
}
//设置支付密码 (已绑定卡号)
export function setPayPassWord(data) {
  return api({url:'wx/set_pay_password',method:'post',data:data})
}
//验证支付密码 (已绑定卡号)
export function validPassWord(data) {
  return api({url:'wx/valid__pay_password',method:'get',data:data})
}
//余额支付 (已绑定卡号)
export function postPayDataBy(data) {
  return api({url:'wx/charge_with_balance',method:'post',data:data})
}
//验证登录 (已绑定卡号)
export function postAccountDataBy(data) {
  return api({url:'wx/valid_login',method:'post',data:data})
}
//绑定微信 (未绑定卡号)
export function postBindDataBy(data) {
  return api({url:'wx/bind_open_id',method:'post',data:data})
}
//绑定微信 (未绑定卡号)
export function postUnbindDataBy(data) {
  return api({url:'wx/unbind_open_id',method:'post',data:data})
}
//流量查询
export function getRemainBy(data) {
  return api({url:'wx/data_query?',method:'get',data:data})
}
//发送验证码
export function getCodeByPhone(data) {
  return api({url:'wx/send_sms_code',method:'post',data:data})
}
//订单记录
export function getRecorderBy(data) {
  return api({url:'wx/consume_orders',method:'get',data:data})
}
//重置支付密码 (已绑定卡号)
export function resetPayPassWord(data) {
  return api({url:'wx/modify_pay_password',method:'post',data:data})
}
//check 购买状态 (已购买基础套餐在有效期内无法再次购买)
export function getSiutStatus(data) {
  return api({url:'wx/check_basic_product',method:'get',data:data})
}
//机卡解绑 
export function postCardToUnbind(data) {
  return api({url:'wx/unbind_device',method:'post',data:data})
}
//机卡解绑状态 
export function getCardBindStatus(data) {
  return api({url:'wx/unbind_status',method:'get',data:data})
}
//七牛 token
export function getQiniuToken() {
  return api({url:'wx/get_qiniu_token',method:'get'})
}
//提交认证信息
export function postAuthInfo(data) {
  return api({url:'wx/identity_auth',method:'post',data:data})
}
//智能诊断
export function getDiacrisisResult(data) {
  return api({url:'wx/intelligent_diagnosis',method:'get',data:data})
}
//卡片邀请数据
export function getInviteDate(number) {
  return api({url:'wx/invite_detail',method:'get',data:{card_no:number}})
}
//可兑换产品列表
export function getExchangeDate(number) {
  return api({url:'wx/exchange_products',method:'get',data:{card_no:number}})
}
//兑换产品    (名称不一样)
export function getInvitePrePay(data) {
  return api({url:'wx/invite_pre_pay',method:'get',data:data})
}
export function getAuthPrePay () {
  return api({url:'wx/auth_pre_pay',method:'get',data:data})
}
