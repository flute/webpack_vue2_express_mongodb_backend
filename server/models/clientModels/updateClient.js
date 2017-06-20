const db = require('../../conf/db')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const updateClient = (req, callback) => {

	let id = req.body.id,
		name = req.body.name,
		phone = req.body.phone,
		address = req.body.address,
		user = req.body.user,
		account = req.body.account,
		pwd = req.body.pwd,
		admin = req.session.user._id;

	if( (!account && !pwd) && (!id || !name || !phone || !address || !user || !admin) ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	
	const client = db.get('t_client');
	const users = db.get('t_user');
	
	client.findOne({_id: id}, '-_id')
	.then((result) => {
		if( result ){
			let data = null
			if( account && pwd ){
				data = {
					name: result.name,
					phone: result.phone,
					address: result.address,
					user: result.user,
					flag: result.flag,
					adminAccount: account,
					adminPwd: pwd
				}
			}else{
				data = {
					name: name,
					phone: phone,
					address: address,
					user: user,
					flag: result.flag,
					adminAccount: result.adminAccount?result.adminAccount:null,
					adminPwd: result.adminPwd?result.adminPwd:null
				}
			}
			if( result.user == admin ){
				client.update({_id: id}, data)
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
			}else{
				users.findOne({_id: result.user}, '-_id')
				.then((result) => {
					if( result ){
						if( result.parents.indexOf(admin)>=0 ){
							client.update({_id: id}, data)
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
						}else{
							callback({
								status: 0,
								msg: '没有权限'
							})
						}
					}else{
						callback({
							status: 0,
							msg: '未找到该客户绑定的用户'
						})
					}
				})
			}
		}else{
			callback({
				status: 0,
				msg: '未找到该客户' 
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

module.exports = updateClient