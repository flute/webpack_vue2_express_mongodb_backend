const db = require('../conf/mongodb')
const checkSign = require('../services/checkSign')

const crypto = require('crypto')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const roleId = require('../conf/config').roleId 
const parentId = require('../conf/config').parentId
let roles = [],
	parents = []
roles.push(roleId)
parents.push(parentId)

const client = db.get('t_client')
const user = db.get('t_user')

const updateClient = (req, callback) => {

	const isSignAvailable = checkSign(req)
	if( isSignAvailable.status === 0 ){
		callback({
			status: 0,
			msg: isSignAvailable.msg
		})
		return
	}

	let clientId = req.body.clientId,
		name = req.body.name,
		phone = req.body.phone?req.body.phone:'',
		address = req.body.address?req.body.address:'',
		userName = req.body.userName?req.body.userName:'',
		userAccount = req.body.userAccount?req.body.userAccount:'',
		userPwd = req.body.userPwd?req.body.userPwd:''

	if( !clientId || !name || (userName||userAccount||userPwd)&&( !userName||!userAccount||!userPwd ) ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return
	}

	client.findOne({_id: clientId}, '-_id')
	.then((result) => {
		if( result ){
			if( userName && userAccount && userPwd ){
				user.findOne({account: userAccount}, '-_id')
				.then((result) => {
					if( result ){
						callback({
							status: 0,
							msg: '代理账号已存在'
						})
						return;
					}else{
						user.insert({
							name: userName,
							account: userAccount,
							pwd: md5(userPwd),
							roles: roles,
							parents: parents,
							flag: 1,
						}).then((result) => {
							if(result){
								let data = {
									name : name,
								    phone : phone,
								    address : address,
								    user : result.user,
								    flag : result.flag,
								}
								if( result.adminAccount ){
									data.adminAccount = result.adminAccount
									data.adminPwd = result.adminPwd
								}
								client.update({_id: clientId}, data)
								.then((result) => {
									if( result ){
										callback({
											status: 1,
											msg: 'success'
										})
									}else{
										callback({
											status: 0,
											msg: '更新客户信息失败'
										})
									}
								})
							}else{
								callback({
									status: 0,
									msg: '创建代理用户失败'
								})
								return;
							}
						})
					}
				})
			}else{
				let data = {
					name : name,
				    phone : phone,
				    address : address,
				    user : result.user,
				    flag : result.flag,
				}
				if( result.adminAccount ){
					data.adminAccount = result.adminAccount
					data.adminPwd = result.adminPwd
				}
				client.update({_id: clientId}, data)
				.then((result) => {
					if( result ){
						callback({
							status: 1,
							msg: 'success'
						})
					}else{
						callback({
							status: 0,
							msg: '更新客户信息失败'
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

}

module.exports = updateClient