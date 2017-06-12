const db = require('../../conf/db')

const updateRole = (req, callback) => {

	let id = req.body.id,
		name = req.body.name,
		permission = req.body.permission;

	if( !id || !name || !permission || permission.length==0 ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	const role = db.get('t_role')
	const data = {
		name: name,
		permissions: permission,
		flag: 1
	}

	role.update({_id: id}, data).then((result)=>{
		if( result ){
			callback({
				status: 1,
				msg: 'success'
			})
		}else{
			callback({
				status: 0,
				msg: '更新失败'
			})
		}
	}).then(() => db.close())
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = updateRole