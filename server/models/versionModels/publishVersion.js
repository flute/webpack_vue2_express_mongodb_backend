const db = require('../../conf/db')

const publishVersion = (req, callback) => {

	let id = req.body.id;

	if( !id ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const version = db.get('t_version');

	version.findOne({_id: id}, '-_id').then((result) => {
		if(result){
			let pubstatus = result.pubStatus ? 0 : 1
			version.update({_id: id}, {
				description: result.description,
				name: result.name,
				updateAddr: result.updateAddr,
				platform: result.platform,
				updateType: result.updateType,
				version: result.version,
				createdAt: result.createdAt,
				updateAt: result.updateAt,
				pubStatus: pubstatus,
				flag: result.flag,
			}).then((result) => {
				if(result){
					callback({
						status: 1,
						msg: 'success'
					})
				}else{
					callback({
						status: 0,
						msg: '发布失败'
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
				msg: '未找到该版本'
			})
		}
	}).catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = publishVersion