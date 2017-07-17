const async = require('async')
const waterfall = require('async/waterfall')

const crypto = require('crypto')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const checkSign = require('../services/checkSign')
const db = require('../conf/mongodb')
const bill = require('../conf/config').bill 
const initManager = require('./initManager')

const roleId = require('../conf/config').roleId 
const parentId = require('../conf/config').parentId
let roles = [],
	parents = []
roles.push(roleId)
parents.push(parentId)

const user = db.get('t_user')
const client = db.get('t_client')
const service = db.get('t_client_service')

const openService = (req, callback) => {
	
	const isSignAvailable = checkSign(req)
	if( isSignAvailable.status === 0 ){
		callback({
			status: 0,
			msg: isSignAvailable.msg
		})
		return
	}
	/**
	 * 参数集合
	 * name phone address user userPwd adminAccount adminPwd 
	 */
	let name = req.body.name,
		phone = req.body.phone?req.body.phone:'',
		address = req.body.address?req.body.address:'',
		userName = req.body.userName,
		userAccount = req.body.userAccount,
		userPwd = req.body.userPwd,
		adminAccount = req.body.adminAccount,
		adminPwd = req.body.adminPwd,
		startTime = req.body.startTime,
		serviceYear = req.body.serviceYear,
		userNum = req.body.userNum


	if( !name || !userName || !userAccount || !userPwd || !adminAccount || !adminPwd || !startTime || !serviceYear || !userNum ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return
	}

	async.waterfall([
		function(call){
			// 新建代理用户
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
					}).then((result) => { console.log('新增代理用户', result)
						if(result){
							call(null, result._id)
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
		},
		function(userId, call){
			// 新建客户
			client.insert({
				name : name,
			    phone : phone,
			    address : address,
			    user : userId.toString(),
			    adminAccount : adminAccount,
			    adminPwd : adminPwd,
			    flag : 1,
			}).then((result) => {	console.log('新增客户', result)
				if( result ){
					call(null, userId, result._id)
				}else{
					user.remove({_id: userId.toString()})
					callback({
						status: 0,
						msg: '创建客户失败'
					})
					return;
				}
			})
		},
		function(userId, clientId, call){
			// 新建服务并开通
			let datas = {
				clientid: clientId,
				account: adminAccount,
				pwd: adminPwd
			}
			initManager(datas, function(res){
				if( res.status != 1 ){
					user.remove({_id: userId.toString()})
					client.remove({_id: clientId.toString()})
				}
				if( res.status == 0 ){
					callback({
						status: 0,
						msg: '初始化管理平台账号失败'
					})
					return;
				}else if( res.status == 2 ){
					callback({
						status: 0,
						msg: '客户信息已存在，开通失败'
					})
					return;
				}else if( res.status == 3 ){
					callback({
						status: 0,
						msg: '管理平台账号已存在，请输入其他账号'
					})
					return;
				}else if( res.status == 1 ){
					let date = new Date(startTime)
					let endTime = ( date.getFullYear()+Number(serviceYear) )+'-'+(date.getMonth()+1)+'-'+date.getDate()
					endTime = new Date(endTime)

					let month = []
					month.push( serviceYear*12 )

					let settle = serviceYear * 12 * bill.price * userNum
					settle = settle<2000 ? 2000 : settle

					service.insert({
					    clientId : clientId.toString(),
					    startTime : new Date(startTime),
					    endTime : endTime,
					    userNum : userNum,
					    createAt : new Date(),
					    closeAt : null,
					    status : 1,
					    month : month,
					    settle : settle,
					    difference : settle,
					    differenceWith : null,
					    first : true
					}).then((result) => {	console.log('新增服务：', result)
						if( result ){
							call(null, result)
						}else{
							call(new Error('创建服务失败'))
						}
					})
				}
			})
		}], function(err, result){
			console.log('创建完成', err, result)
			if( err ){
				callback({
					status: 0,
					msg: err
				})
			}else{
				callback({
					status: 1,
					msg: 'success',
					data: result
				})
			}
	})

}

module.exports = openService