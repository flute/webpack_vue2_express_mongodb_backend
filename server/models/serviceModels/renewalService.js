const db = require('../../conf/db')
const redis = require('../../conf/redis')
const checkPermission = require('./checkPermission')

const Bill = require('../../conf/config')
const getMonth = require('../../services/getMonth')

const renewalService = (req, callback) => {

	let clientId = req.body.clientid
		serviceId = req.body.serviceid
		endTime = req.body.endtime
		userNum = req.body.usernum

	if( !clientId || !serviceId || !endTime || !userNum ){
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
						// 续期后的结束日期<当前时间，即为过期，修改redis状态
						if( new Date(endTime).valueOf() < new Date().valueOf() ){
							// redis add client
							redis.select('1', function(error){
							    if(error){
							        console.error('renewal service redis close service failed:', error);
							    }else{
							        redis.set(clientId, 0, function(err, res){  
								        console.log('renewal service redis close client:'+clientId, err, res); 
								    });
							    }
							});
						}else{
							redis.select('1', function(error){
							    if(error){
							        console.error('renewal service redis open service failed:', error);
							    }else{
							        redis.set(clientId, 1, function(err, res){  
								        console.log('renewal service redis open client:'+clientId, err, res); 
								    });
							    }
							});
						}

						// 记录上条记录的截止时间，作为续接的开始时间
						const renewalStartTime = result.endTime

						// settle
						let settle = 0
						let difference = 0
						let month = 0

						userNum = Number(userNum)
						
						if( userNum < Bill.limit ){
							settle = Bill.minPrice
						}else{
							month = getMonth(result.startTime, endTime)
							settle = month * Bill.price * userNum
							settle = settle<Bill.minPrice? Bill.minPrice : settle
						}

						difference = Number( (settle - result.settle).toFixed(2) )
						
						service.update({_id: serviceId},{
							clientId : result.clientId,
						    startTime : result.startTime,
						    endTime : result.endTime,
						    userNum : result.userNum,
						    createAt : result.createAt,
						    closeAt : null,
						    status : 2,
						    first: result.first,
						    month: result.month,
						    settle: result.settle,
						    difference: result.difference,
						    differenceWith: result.differenceWith
						}).then((result) => {
							if(result){
								service.insert({
									clientId: clientId,
									startTime: renewalStartTime,
									endTime: endTime,
									userNum: userNum,
									createAt: new Date(),
									closeAt: null,
									status: 1,
									month: month,
									settle: settle,
									difference: difference,
									differenceWith: serviceId
								}).then((result) => {
									if(result){
										callback({
											status: 1,
											msg: 'success'
										})
									}else{
										callback({
											status: 0,
											msg: '续接失败'
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
									msg: '续接失败'
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
							msg: '当前服务无法执行续接操作！'
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

module.exports = renewalService