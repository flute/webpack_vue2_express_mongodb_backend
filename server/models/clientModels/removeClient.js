const db = require('../../conf/db')

const removeClient = (req, callback) => {

	const name = req.body.name;
	const admin = req.session.user.account;
	const client = db.get('t_client');
	const user = db.get('t_user');

	client.findOne({ename: name}, '-_id')
	.then((result) => {
		if( result ){
			let data = {
				cname: result.cname,
				ename: result.ename,
				user: result.user,
				phone: result.phone,
				address: result.address,
				flag: 0
			}
			// 判断是否权限删除
			if( result.user == admin ){
				client.update({ename: name}, data)
				.then((result) => {
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
				})
				.catch((error) => {
					callback({
						status: 0,
						msg: error
					})
				})
			}else{
				user.findOne({account: result.user}, '-_id')
				.then(( result ) => {
					if( result ){
						if( result.parents.indexOf(admin)>= 0 ){
							client.update({ename: name}, data)
							.then((result) => {
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
							})
							.catch((error) => {
								callback({
									status: 0,
									msg: error
								})
							})
						}else{
							re.json({
								status: 0,
								msg: '没有权限'
							})
						}
					}else{
						callback({
							status: 0,
							msg: '未找到客户绑定的用户'
						})
					}
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

module.exports = removeClient