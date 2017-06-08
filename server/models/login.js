const crypto = require('crypto')
const db = require('../conf/db')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')
const getAllPermission = require('./getAllPermission');

const login = (req, callback) => {

	let account = req.body.account,
		pwd = req.body.pwd;

	const user = db.get('t_user');
	user.findOne({account: account}, '-_id').then((userinfo)=>{
		if( userinfo ){
			console.log('userinfo', userinfo)
			if( md5(pwd) == userinfo.pwd ){
				getAllPermission(userinfo, function(result){
					console.log('Result：', result)
					if( !result.status ){
						callback(result);
					}else{
						req.session.user = userinfo;
						req.session.permission = result.permission;
						console.info('session：',req.session)
						callback(result);
					}
				})
			}else{
				let data = {
					status: 0,
					msg: 'wrong password'
				}
				callback(data);
			}
		}else{
			// 没有此用户
			let data = {
				status: 0,
				msg: 'no user'
			}
			callback(data);
		}
	})
	.catch((err) => {
		if(err){
			console.log(err)
			callback({status: 0, msg: '发生未知错误'})
		}
	})
}

module.exports = login