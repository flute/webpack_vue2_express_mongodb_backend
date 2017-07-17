const appkeys = require('../conf/config').api 
const crypto = require('crypto')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const checkSign = (req) => {

	if( !req.body.app_key || !req.body.sign || !req.body.timestamp ){
		return {
			status: 0,
			msg: '参数不足'
		}
	}

	let unixTimestamp = Math.round(new Date().getTime()/1000)

	if( Math.abs(unixTimestamp-req.body.timestamp)>5*60 ){
		return {
			status: 0,
			msg: '请求已过期'
		}
	}

	if( !appkeys[req.body.app_key] ){
		return {
			status: 0,
			msg: 'app_key不存在'
		}
	}

	let argumentsNames = []
	let str = ''

	for( let i in req.body ){
		if( i!='app_key' && i!='sign' && i!='timestamp' ){
			argumentsNames.push(i)
		}
	}

	argumentsNames.sort(function(a, b){
		if(a>b){
			return 1
		}else{
			return -1
		}
	})

	for( var i=0;i<argumentsNames.length;i++ ){
		str += (argumentsNames[i]+req.body[argumentsNames[i]])
	}
	str += ('timestamp'+req.body.timestamp)
	str += appkeys[req.body.app_key]

	console.log('sign:', str)
	console.log('md5:', md5(str), req.body.sign)
	if( md5(str) == req.body.sign ){
		// 签名验证通过
		return {
			status: 1,
			msg: 'success'
		}
	}else{
		return {
			status: 0,
			msg: '签名错误'
		}
	}

}

module.exports = checkSign