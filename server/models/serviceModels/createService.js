const db = require('../../conf/db')
const checkPermission = require('./checkPermission')

const createService = (req, callback) => {

	let clientId = req.body.clientid
		startTime = req.body.starttime
		endTime = req.body.endtime
		userNum = req.body.usernum

	if( !clientId || !startTime || !endTime || !userNum){
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
			service.insert({
				clientId: clientId,
				startTime: startTime,
				endTime: endTime,
				userNum: userNum,
				createAt: new Date(),
				closeAt: null,
				status: 0
			})
			.then((result) => {
				if( result){
					callback({
						status: 1,
						msg: 'success'
					})
				}else{
					callback({
						status: 0,
						msg: '新增失败'
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

module.exports = createService