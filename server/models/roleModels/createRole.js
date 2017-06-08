const db = require('../../conf/db')
const slugify = require('transliteration').slugify

const createRole = (req, callback) => {

	let name = req.body.name,
		permission = req.body.permission;

	if( !name || !permission || permission.length==0 ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const role = db.get('t_role')
	role.insert({
		cname: name,
		ename: slugify(name),
		permissions: permission,
		flag: 1
	}).then((result)=>{
		if( result ){
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
	}).then(() => db.close())
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = createRole