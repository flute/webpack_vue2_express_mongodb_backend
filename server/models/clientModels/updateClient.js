const db = require('../../conf/db')
const slugify = require('transliteration').slugify

const updateClient = (req, callback) => {

	let id = req.body.id,
		name = req.body.name,
		phone = req.body.phone,
		address = req.body.address,
		user = req.body.user,
		endtime = req.body.endtime,
		max = req.body.max,
		status = req.body.status,
		admin = req.session.user._id;
	if( !id || !name || !phone || !address || !user || !admin || !endtime || !max || status==null){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}
	
	const client = db.get('t_client');
	const users = db.get('t_user');
	ename = slugify(name);
	client.findOne({_id: id}, '-_id')
	.then((result) => {
		if( result ){
			let data = {
				name: name,
				phone: phone,
				address: address,
				user: user,
				endtime: endtime,
				max: max,
				status: status,
				flag: result.flag
			}
			if( result.user == admin ){
				client.update({_id: id}, data)
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
				users.findOne({_id: result.user}, '-_id')
				.then((result) => {
					if( result ){
						if( result.parents.indexOf(admin)>=0 ){
							client.update({_id: id}, data)
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