const db = require('../../conf/db')

const createClient = (req, callback) => {

	let name = req.body.name,
		phone = req.body.phone,
		address = req.body.address,
		user = req.body.user;

	if( !name || !phone || !address || !user ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const client = db.get('t_client')
	client.insert({
		name: name,
		phone: phone,
		address: address,
		user: user,
		flag: 1
	})
	.then((result) => {
		if( result){
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
	})
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = createClient