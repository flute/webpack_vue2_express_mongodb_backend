const db = require('../../conf/db')
// 检测是否有权对当前客户的服务进行操作
const checkPermission = (req, callback) => {

	let clientid = req.body.clientid,
		adminid = req.session.user._id

	const client = db.get('t_client')
	const user = db.get('t_user')

	client.findOne({_id: clientid, flag: 1},'-_id')
	.then((result) => {
		if(result){
			if( result.user == adminid ){
				callback({
					status: 1,
					msg: 'success'
				})
			}else{
				user.findOne({_id: result.user}, '-_id')
				.then((result) => {
					if(result.parents.indexOf(adminid)>=0){
						callback({
							status: 1,
							msg: 'success'
						})
					}else{
						callback({
							status: 0,
							msg: '无权查看该客户'
						})
					}
				})
				.catch((error) => {
					callback({
						status: 0,
						msg: '未找到绑定的用户'
					})
				})
			}
		}else{
			callback({
				status: 0,
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
}

module.exports = checkPermission