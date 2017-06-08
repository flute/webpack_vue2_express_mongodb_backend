const db = require('../../conf/db')
const slugify = require('transliteration').slugify

const updateClient = (req, callback) => {

	let name = req.body.name,
		phone = req.body.phone,
		address = req.body.address,
		user = req.body.user,
		admin = req.session.user.account;
	if( !name || !phone || !address || !user || !admin ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	
	const client = db.get('t_client');
	const users = db.get('t_user');
	ename = slugify(name);
	client.findOne({ename: ename}, '-_id')
	.then((result) => {
		if( result ){
			let data = {
				cname: name,
				ename: ename,
				phone: phone,
				address: address,
				user: user,
				flag: result.flag
			}
			if( result.user == admin ){
				client.update({ename: ename}, data)
				.then((result) => {
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
				})
				.catch((error) => {
					callback({
						status: 0,
						msg: error
					})
				})
			}else{
				users.findOne({account: result.user}, '-_id')
				.then((result) => {
					if( result ){
						if( result.parents.indexOf(admin)>=0 ){
							client.update({ename: ename}, data)
							.then((result) => {
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
							})
							.catch((error) => {
								callback({
									status: 0,
									msg: error
								})
							})
						}else{
							callback({
								status: 0,
								msg: '没有权限'
							})
						}
					}else{
						callback({
							status: 0,
							msg: '未找到该客户绑定的用户'
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

module.exports = updateClient