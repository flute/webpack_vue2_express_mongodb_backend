const db = require('../../conf/db')
const redis = require('../../conf/redis')
const checkPermission = require('./checkPermission')

const Bill = require('../../conf/config')
const getMonth = require('../../services/getMonth')

const closeService = (req, callback) => {

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

					// settle
					let settle = 0
					let difference = 0
					let month = 0
					let endTime = new Date()

					if( new Date(result.startTime).valueOf()>=endTime.valueOf() ){
					// 服务未开始
						month = 0
						settle = 0
						difference = 0
					}else{
						userNum = Number(result.userNum)

						if( userNum < Bill.limit ){
							settle = Bill.minPrice
						}else{
							month = getMonth(result.startTime, endTime)
							settle = month * Bill.price * userNum
							settle = settle<Bill.minPrice? Bill.minPrice : settle
						}
						
						difference = Number( (settle - result.settle).toFixed(2) )
					}

					

					if( result.status === 1 ){
						service.update({_id: serviceId},{
							clientId : result.clientId,
						    startTime : result.startTime,
						    endTime : result.endTime,
						    userNum : result.userNum,
						    createAt : result.createAt,
						    closeAt : new Date(),
						    status : 4,
						    first: result.first,
						    month: month,
						    settle: settle,
						    difference: difference,
						    differenceWith: result.differenceWith
						}).then((result) => {
							if(result){
								callback({
									status: 1,
									msg: 'success'
								})
								// redis add client
								redis.select('1', function(error){
								    if(error){
								        console.error('redis close service failed:', error);
								    }else{
								        redis.set(clientId, 0, function(err, res){  
									        console.log('redis close client:'+clientId, res); 
									    });
								    }
								});
							}else{
								callback({
									status: 0,
									msg: '关闭失败'
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
							msg: '当前服务无法执行关闭操作！'
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

module.exports = closeService