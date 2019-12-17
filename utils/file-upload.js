import * as qiniu from './qiniu.min.js'
export function postToQiniu(file,key,uptoken) {
    //这里base-html是存储空间名

    console.log
    let config = {
      useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
      region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
    };

    let putExtra = {
      fname: file.name,  //文件原文件名
      params: {}, //用来放置自定义变量
      mimeType: ["image/png", "image/jpeg", "image/gif"]  //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
    };
    return new Promise((resolve,reject)=>{
        var observable = qiniu.upload(file, key, uptoken, putExtra, config);
        observable.subscribe({
            next: res => {
            // 主要用来展示进度
            },
            error: err => {
            // 失败报错信息
                reject(err)
            },
            complete: res => {
            // 接收成功后返回的信息
                resolve(res)
            }
        })
    })
    
  }