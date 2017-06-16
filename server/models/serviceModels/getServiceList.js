const db = require('../../conf/db')
const checkPermission = require('./checkPermission')

const getServiceList = (req, callback) => {

	let clientid = req.body.clientid
		adminid = req.session.user._id

	if( !clientid ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const service = db.get('t_client_service')

	checkPermission(req, function(result){
		if( result.status ){
			service.find({clientId: clientid}, '-_clientId')
			.then((result) => {
				if( result ){
					callback({
						status: 1,
						msg: 'success',
						data: result
					})
				}else{
					callback({
						status: 0,
						msg: '未找到该客户的服务信息'
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

module.exports = getServiceList