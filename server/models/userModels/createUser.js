const crypto = require('crypto')
const db = require('../../conf/db')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

const createUser = (req, callback) => {

	let name = req.body.name,
		account = req.body.account,
		pwd = req.body.pwd,
		roles = req.body.roles,
		creator = req.session.user._id;

	if( !name || !account || !pwd || !roles || roles.length==0 ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const user = db.get('t_user')
	user.findOne({_id: creator}, '-_id').then((result)=>{
		if( result ){
			// 代理级数控制
			if( result.parents.length == 9 ){
				callback({
					status: 0,
					msg: '最多为十级代理，如需开通，请联系管理人员'
				})
				return;
			}
			// 父级创建者记录
			let parents = result.parents
				parents.push(creator)
			user.insert({
				name: name,
				account: account,
				pwd: md5(pwd),
				roles: roles,
				parents: parents,
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
		}else{
			callback({
				status: 0,
				msg: '未找到创建者'
			})
		}
	}).catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = createUser