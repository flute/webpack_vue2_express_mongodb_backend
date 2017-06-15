const db = require('../../conf/db')

const getServiceList = (req, callback) => {

	let clientid = req.body.clientid,
		adminid = req.session.user._id;

	if( !clientid ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const client = db.get('t_client')
	const user = db.get('t_user')
	const service = db.get('t_client_service')

	client.findOne({_id: clientid, flag: 1},'-_id')
	.then((result) => {
		if(result){
			if( result.user == adminid ){
				getService(clientid)
			}else{
				user.findOne({_id: result.user}, '-_id')
				.then((result) => {
					if(result.parents.indexOf(adminid)>=0){
						getService(clientid)
					}else{
						callback({
							ststus: 0,
							msg: '无权查看该客户'
						})
					}
				})
				.catch((error) => {
					callback({
						ststus: 0,
						msg: '未找到绑定的用户'
					})
				})
			}
		}else{
			callback({
				ststus: 0,
				msg: '未找到该客户'
			})
		}
	})
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})

	let getService = (cid) => {
		service.find({clientId: cid}, '-_clientId')
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
	}
	
}

module.exports = getServiceList