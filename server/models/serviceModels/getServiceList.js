const async = require('async')
const db = require('../../conf/db')
const checkPermission = require('./checkPermission')

const getServiceList = (req, callback) => {

	let clientid = req.body.clientid
		type = req.body.type
		adminid = req.session.user._id


	if( !clientid || (clientid.length == 0 && type && type === 'all') ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const service = db.get('t_client_service')

	if( !type ){
		// 获取指定客户的服务
		checkPermission(req, function(result){
			if( result.status ){
				let client = result.client
				service.find({clientId: clientid}, {fields: { _clientId: 0 },sort: {createAt: -1}})
				.then((result) => {
					if( result ){
						callback({
							status: 1,
							msg: 'success',
							data: result,
							client: client
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
	}else if( type === 'all' ){
		// 获取多个客户的服务
		let services = []
		async.eachSeries(clientid, function(item, cb){

			service.find({clientId: item}, {fields: { _id: 0 },sort: {createAt: -1}})
			.then((result) => {
				if( result && result.length>0 ){
					if( result.length > 0 ){
						let lastService = result[ result.length-1 ]
						services.push(lastService)
					}else{
						services.push(result)
					}
				}
				cb()
			})
		},function(err, result){
			callback({
				status: 1,
				msg: 'success',
				data: services
			})
		})

	}
			
}

module.exports = getServiceList