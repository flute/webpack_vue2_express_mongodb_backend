const db = require('../../conf/db')
const checkPermission = require('./checkPermission')

const removeService = (req, callback) => {

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
						service.remove({_id: serviceId})
						.then((result) => {
							if(result){
								callback({
									status: 1,
									msg: 'success'
								})
							}else{
								callback({
									status: 0,
									msg: '删除失败'
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
							msg: '当前服务无法执行删除操作！'
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

module.exports = removeService