const db = require('../../conf/db')
const redis = require('../../conf/redis')
const checkPermission = require('./checkPermission')

const Bill = require('../../conf/config')
const getMonth = require('../../services/getMonth')

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
					// nothing changed
					if( new Date(result.startTime).valueOf()==new Date(startTime).valueOf() && new Date(result.endTime).valueOf()==new Date(endTime).valueOf() && userNum==result.userNum ){
						callback({
							status: 1,
							msg: 'success'
						})
					}else{
					
						if( result.status === 1 ){
							// 如果变更后的结束日期<当前时间，即为过期，修改redis状态
							if( new Date(endTime).valueOf() < new Date().valueOf() ){
								// redis add client
								redis.select('1', function(error){
								    if(error){
								        console.error('change service redis close service failed:', error);
								    }else{
								        redis.set(clientId, 0, function(err, res){  
									        console.log('change service redis close client:'+clientId, res); 
									    });
								    }
								});
							}else{
								redis.select('1', function(error){
								    if(error){
								        console.error('change service redis open service failed:', error);
								    }else{
								        redis.set(clientId, 1, function(err, res){  
									        console.log('change service redis open client:'+clientId, res); 
									    });
								    }
								});
							}
							// settle
							let settle = 0
							let difference = 0
							let month = 0

							userNum = Number(userNum)
								
							if( userNum < Bill.limit ){
								settle = Bill.minPrice
							}else{
								month = getMonth(startTime, endTime)
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
							    status : 3,
							    month: result.month,
							    settle: result.settle,
							    difference: result.difference,
							    differenceWith: result.differenceWith,
							    first: result.first
							}).then((result) => {
								if(result){
									service.insert({
										clientId: clientId,
										startTime: startTime,
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