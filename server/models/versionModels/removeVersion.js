const db = require('../../conf/db')

const removeVersion = (req, callback) => {

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
			version.update({_id: id}, {
				description: result.description,
				name: result.name,
				updateAddr: result.updateAddr,
				platform: result.platform,
				updateType: result.updateType,
				version: result.version,
				createdAt: result.createdAt,
				updateAt: result.updateAt,
				pubStatus: result.pubStatus,
				flag: 0,
			}).then((result) => {
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

module.exports = removeVersion