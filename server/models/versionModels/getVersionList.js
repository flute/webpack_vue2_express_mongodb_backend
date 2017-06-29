const db = require('../../conf/db')

const getVersionList = (req, callback) => {

	const version = db.get('t_version');

	version.find({flag: 1}, '-flag')
	.then((result) => {
		if( result ){
			callback({
				status: 1,
				msg: 'success',
				data: result
			})
		}else{
			callback({
				status: 0,
				msg: '未找到版本数据'
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

module.exports = getVersionList