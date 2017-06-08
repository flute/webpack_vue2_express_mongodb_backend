const db = require('../../conf/db')

const removeUser = (req, callback) => {

	const account = req.body.account;
	const creator = req.session.user.account;
	const users = db.get('t_user');
	if( !account ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	users.findOne({account: account}, '-_id')
	.then((result)=>{
		if( result ){
			if( result.parents.indexOf(creator)>=0 ){
				// 父级代理，有权删除
				result.flag = 0;
				users.update({account: account}, result).then((result)=>{
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
					msg: '没有权限'
				})
			}
		}else{
			callback({
				status: 0,
				msg: "未找到用户"
			})
		}
	})
	.catch((error)=>{
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = removeUser