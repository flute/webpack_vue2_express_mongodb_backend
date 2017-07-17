const db = require('../conf/mongodb')
const checkSign = require('../services/checkSign')
const bill = require('../conf/config').bill 

const mysql = require('mysql')
const conf = require('../conf/mysql')
const pool = mysql.createPool( conf.mysql )

const crypto = require('crypto')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const client = db.get('t_client')

const changePassword = (req, callback) => {

	const isSignAvailable = checkSign(req)
	if( isSignAvailable.status === 0 ){
		callback({
			status: 0,
			msg: isSignAvailable.msg
		})
		return
	}

	let clientId = req.body.clientId,
		account = req.body.account,
		oldPwd = req.body.oldPwd,
		newPwd = req.body.newPwd

	if( !clientId || !account || !oldPwd || !newPwd ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return
	}

	client.findOne({_id: clientId}, '-_id')
	.then((result) => {
		if( result ){
			if( !result.adminAccount ){
				callback({
					status: 0,
					msg: '该客户还未创建管理平台账号'
				})
			}else{
				if( oldPwd!=result.adminPwd ){
					callback({
						status: 0,
						msg: '旧密码错误'
					})
					return;
				}

				let data = {
					name: result.name,
					phone: result.phone,
					address: result.address,
					user: result.user,
					flag: result.flag,
					adminAccount: result.adminAccount,
					adminPwd: newPwd
				}
				pool.getConnection(function(err, connection){
					if( err ){
						console.error('mysql connected error:', err)
						callback({
							status: 0,
							msg: 'mysql connected failed'
						})
						// 连接失败
						return;
					}else{
						connection.query("update t_admin set password='"+md5(newPwd)+"' where tenantId='"+clientId+"'", function(err, res){
							if( err ){
								callback({
									status: 0,
									msg: '更新管理平台密码失败'
								})
							}else{

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
											msg: '修改密码失败'
										})
									}
								})

							}
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

module.exports = changePassword