const db = require('../../conf/db')
const slugify = require('transliteration').slugify

const updateRole = (req, callback) => {

	let oldname = req.body.oldname,
		newname = req.body.newname,
		permission = req.body.permission;

	if( !oldname || !newname || !permission || permission.length==0 ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	const role = db.get('t_role')
	const data = {
		cname: newname,
		ename: slugify(newname),
		permissions: permission,
		flag: 1
	}

	role.update({ename: oldname}, data).then((result)=>{
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