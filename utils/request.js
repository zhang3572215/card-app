import baseUrl from './url.js'
export default function api(param) {
  let option ={
    method: 'get',
    header: {
      'content-type':'application/x-www-form-urlencoded'
    }
  }
  Object.assign(option,param)
  switch (option.method) {
    case 'post':
      return PostRequest(option);
      break;
    case 'get':
      return getRequest (option);
      break;
    default: return postRequest(option.url,option.data)
  }
}
function  postRequest (option) {
    return new Promise((resolve, reject) => { 
		uni.request({
			method: 'POST',
			url: baseUrl+option.url,
			data: option.data,      
			header: option.header
		}).then(data => {
			let [error, res] = data
			if (res){
				resolve(res)
			}
			if (error){
				reject(error)
			}
		})
	})
}
function PostRequest (option) {
    return new Promise((resolve, reject) => {
		uni.request({
			method: 'post',
			url: baseUrl+option.url,
			data: option.data,      
			header: option.header || {'content-type':'multipart/form-data'}
		}).then(data => {
			let [error, res] = data
			if (res){
				resolve(res)
			}
			if (error){
				reject(error)
			}
		})
	})
}

// function uploadFileRequest (url, datas) {
//     return axios({
//       method: 'post',
//       url: `$baseUrl${url}`,
//       params: datas,
//       headers: {
//         'Content-Type': 'multipart/form-data; boundary=converge'
//       }
//     })
//   }

  //function putRequest (url, params) {
  //   return axios({
  //     method: 'put',
  //     url: `${url}`,
  //     data: params,
  //     transformRequest: [function (data) {
  //       let ret = ''
  //       for (let it in data) {
  //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  //       }
  //       return ret
  //     }],
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   })
  // }

  //function deleteRequest (url) {
  //   return axios({
  //     method: 'delete',
  //     url: `${url}`
  //   })
  // }

function getRequest (option) {
    if (option.data){
      return new Promise((resolve, reject) => {
		  uni.request({
		    method: 'GET',
		    url:baseUrl+option.url,
		    data: option.data,
		    headers: option.header
		  }).then(data => {
			  let [error, res] = data
			  if (res){
				  resolve(res)
			  }
			  if (error){
				  reject(error)
			  }
		  })
	  })	  
    }else {
      return new Promise((resolve, reject) => {
		  uni.request({
			url: baseUrl+option.url,
			method: 'GET',
			headers: option.header
		  }).then(data => {
			  let [error, res] = data
			  if (res){
				  resolve(res)
			  }
			  if (error){
				  reject(error)
			  }
		  })
	  })
    }

}