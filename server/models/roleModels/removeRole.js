const db = require('../../conf/db')

const removeRole = (req, callback) => {

	let id = req.body.id;
	if( !id ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	const role = db.get('t_role')
	role.findOne({_id: id}, '-_id').then((result) => {
		if( result ){
			result.flag = 0;
			role.update({_id: id}, result).then((result)=>{
				if( result ){
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
			}).then(() => db.close())
		}else{
			callback({
				status: 0,
				msg: '未找到该角色'
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

module.exports = removeRole