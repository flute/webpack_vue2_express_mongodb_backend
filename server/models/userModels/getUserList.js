const db = require('../../conf/db')

const getUserList = (req, callback) => {

	const users = db.get('t_user');
	const admin = req.session.user._id;

	users.find({flag: 1}, '-flag')
	.then((result)=>{
		if( result ){
			let data = [];
			for( let i=0;i<result.length;i++ ){
				// 如果是上级，有权查看，否则无
				if( result[i].parents.indexOf(admin)>=0 || result[i]._id.toString() === req.session.user._id.toString() ){
					data.push(result[i])
				}
			}
			callback({
				status: 1,
				msg: 'success',
				data: data
			})
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

module.exports = getUserList