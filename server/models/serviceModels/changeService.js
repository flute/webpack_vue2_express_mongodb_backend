const db = require('../../conf/db')
const checkPermission = require('./checkPermission')

const changeService = (req, callback) => {

	let clientId = req.body.clientid
		serviceId = req.body.serviceid
		startTime = req.body.starttime
		endTime = req.body.endtime
		userNum = req.body.usernum

	if( !clientId || !serviceId || !startTime || !endTime || !userNum ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	/**
	 * status
	 * 0: 未开通 
	 * 1: 已开通
	 * 2: 已续接
	 * 3: 已变更
	 * 4: 已关闭
	 */
	const service = db.get('t_client_service')

	checkPermission(req, function(result){
		if( result.status ){
			service.findOne({_id: serviceId}, '-_id')
			.then((result) => {
				if( result ){
					if( result.status === 1 ){
						
						service.update({_id: serviceId},{
							clientId : result.clientId,
						    startTime : result.startTime,
						    endTime : result.endTime,
						    userNum : result.userNum,
						    createAt : result.createAt,
						    closeAt : null,
						    status : 3
						}).then((result) => {
							if(result){
								service.insert({
									clientId: clientId,
									startTime: startTime,
									endTime: endTime,
									userNum: userNum,
									createAt: new Date(),
									closeAt: null,
									status: 1
								}).then((result) => {
									if(result){
										callback({
											status: 1,
											msg: 'success'
										})
									}else{
										callback({
											status: 0,
											msg: '变更失败'
										})
									}
								}).catch((error) => {
									callback({
										status: 0,
										msg: error
									})
								})
							}else{
								callback({
									status: 0,
									msg: '变更失败'
								})
							}
						}).catch((error) => {
							callback({
								status: 0,
								msg: error
							})
						})
					}else{
						callback({
							status: 0,
							msg: '当前服务无法执行修改操作！'
						})
					}
				}else{
					callback({
						status: 0,
						msg: '未找到该服务'
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
			callback(result)
		}
	})
	
}

module.exports = changeService