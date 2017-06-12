const async = require('async')
const db = require('../../conf/db')

const getClientList = (req, callback) => {

	const client = db.get('t_client');
	const user = db.get('t_user');
	const admin = req.session.user._id;

	client.find({flag: 1}, '-flag')
	.then((result) => {
		if( result ){
			let datas = [];
			async.eachSeries(result, function(item, cback){
				// 本人是客户的管理员
				if( item.user == admin ){ 
					item.username = req.session.user.name
					datas.push( item )
					cback()
				}else{
					user.findOne({_id: item.user}, '-_id')
					.then((result) => {
						if( result ){
							if( result.parents.indexOf( admin )>=0 ){
								// 如果是 客户绑定的管理员 的父级，有权查看
								item.username = result.name
								datas.push( item )
							}
						}
						cback()
					})
					.catch((err) => {
						cback(err)
					})
				}
			},function(err, result){
				if( err ){
					callback({
						status: 0,
						msg: err
					})
				}else{
					callback({
						status: 1,
						msg: 'success',
						data: datas
					})
				}
			})
		}else{
			callback({
				status: 0,
				msg: '查询客户失败'
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

module.exports = getClientList