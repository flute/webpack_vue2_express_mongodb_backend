const db = require('../../conf/db')
const redis = require('../../conf/redis')
const checkPermission = require('./checkPermission')

const pauseresumeService = (req, callback) => {

	let clientId = req.body.clientid
		serviceId = req.body.serviceid

	if( !clientId || !serviceId ){
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

						// 1:暂停，0:正常
						let pauseResume = null
						let status = null

						if( result.pauseResume ){
							pauseResume = result.pauseResume
							pauseResume.status = pauseResume.status?0:1
							let option = pauseResume.status?'pause':'resume'
							pauseResume.record.push({
								createAt: new Date(),
								option: option
							})
							// redis status
							status = pauseResume.status?0:1
						}else{
							pauseResume = {}
							pauseResume.status = 1
							pauseResume.record = []
							pauseResume.record.push({
								createAt: new Date(),
								option: 'pause'
							})
							// redis status
							status = 0
						}

						service.update({_id: serviceId},{
							clientId : result.clientId,
						    startTime : result.startTime,
						    endTime : result.endTime,
						    userNum : result.userNum,
						    createAt : result.createAt,
						    closeAt : result.closeAt,
						    status : result.status,
						    month: result.month,
						    settle: result.settle,
						    difference: result.difference,
						    differenceWith: result.differenceWith,
						    first: result.first,
						    pauseResume: pauseResume
						}).then((result) => {
							if(result){ 
								callback({
									status: 1,
									msg: 'success'
								})
								// redis add client
								redis.select('1', function(error){
								    if(error){
								        console.error('redis pauseResume service failed:', error);
								    }else{
								        redis.set(clientId, status, function(err, res){  
									        console.log('redis pauseResume client:'+clientId, res);  
									    });
								    }
								});
							}else{
								callback({
									status: 0,
									msg: '开通失败'
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
							msg: '当前服务无法暂停/恢复开通操作！'
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

module.exports = pauseresumeService