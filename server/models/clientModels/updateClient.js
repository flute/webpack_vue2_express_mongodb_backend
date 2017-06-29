const db = require('../../conf/db')
const initManager = require('../initManager')

const client = db.get('t_client')
const users = db.get('t_user')

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
	
	client.findOne({_id: id}, '-_id')
	.then((result) => {
		if( result ){
			// 首次开通服务，绑定管理员，初始化 MySQL
			if( account && pwd ){
				let datas = {
					clientid: id,
					account: account,
					pwd: pwd
				}
				initManager(datas, function(res){
					console.log(res)
					if( res.status == 0 ){
						callback({
							status: 0,
							msg: '初始化失败'
						})
					}else if( res.status == 1 ){
						let data = {
							name: result.name,
							phone: result.phone,
							address: result.address,
							user: result.user,
							flag: result.flag,
							adminAccount: account,
							adminPwd: pwd
						}
						doUpdate(id, admin, result, data, callback)
					}else if( res.status == 2 ){
						callback({
							status: 2,
							msg: '客户信息已存在，开通失败'
						})
					}else if( res.status == 3 ){
						callback({
							status: 3,
							msg: '账号已存在，请输入其他账号'
						})
					}
				})
				
			}else{
				let data = {
					name: name,
					phone: phone,
					address: address,
					user: user,
					flag: result.flag,
					adminAccount: result.adminAccount?result.adminAccount:null,
					adminPwd: result.adminPwd?result.adminPwd:null
				}
				doUpdate(id, admin, result, data, callback)
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


const doUpdate = (id, admin, result, data, callback) => {

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
}

module.exports = updateClient