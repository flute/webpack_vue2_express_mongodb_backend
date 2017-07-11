const db = require('../../conf/db')
const redis = require('../../conf/redis')
const checkPermission = require('./checkPermission')

const Bill = require('../../conf/config')
const getMonth = require('../../services/getMonth')

const openService = (req, callback) => {

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
					if( result.status === 0 ){

						let userNum = Number(result.userNum)
						let settle = 0
						let month = 0

						if( userNum < Bill.limit ){
							settle = Bill.minPrice
						}else{
							month = getMonth(result.startTime, result.endTime)
							settle = month * Bill.price * userNum
							settle = settle<Bill.minPrice? Bill.minPrice : settle
						}

						service.update({_id: serviceId},{
							clientId : result.clientId,
						    startTime : result.startTime,
						    endTime : result.endTime,
						    userNum : result.userNum,
						    createAt : result.createAt,
						    closeAt : result.closeAt,
						    status : 1,
						    month: month,
						    settle: settle,
						    difference: 0,
						    differenceWith: null,
						    first: true
						}).then((result) => {
							if(result){ 
								callback({
									status: 1,
									msg: 'success'
								})
								// redis add client
								redis.select('1', function(error){
								    if(error){
								        console.error('redis open service failed:', error);
								    }else{
								        redis.set(clientId, 1, function(err, res){  
									        console.log('redis open client:'+clientId, res);  
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
							msg: '当前服务无法执行开通操作！'
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

module.exports = openService