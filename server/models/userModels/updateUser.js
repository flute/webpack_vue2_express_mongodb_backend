const crypto = require('crypto')
const db = require('../../conf/db')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const createUser = (req, callback) => {

	let id = req.body.id,
		name = req.body.name
		account = req.body.account,
		pwd = req.body.pwd,
		roles = req.body.roles,
		creator = req.session.user._id;

	if( !id || !name || !account || !pwd || !roles || roles.length==0 ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const users = db.get('t_user')
	users.findOne({_id:  id}, '-_id')
	.then((result) => {
		if( result ){
			if( result.parents.indexOf( creator )>=0 ){
				let password = result.pwd == pwd ? result.pwd : md5(pwd)
				let data = {
					account: account,
					name: name,
					pwd: password,
					roles: roles,
					parents: result.parents,
					flag: result.flag
				}
				users.update({_id: id}, data)
				.then((result) => {
					if( result ){
						callback({
							status: 1,
							msg: 'success'
						})
					}else{
						callback({
							status: 0,
							msg: '更新失败'
						})
					}
				})
				.catch((error) => {
					callback({
						status: 0,
						msg: error
					})
				})
				.then(() => db.close())
			}else{
				callback({
					status: 0,
					msg: '没有权限'
				})
			}
		}else{
			callback({
				status: 0,
				msg: '未找到该用户'
			})
		}
	})
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = createUser