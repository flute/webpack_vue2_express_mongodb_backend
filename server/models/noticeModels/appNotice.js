const async = require('async')
const db = require('../../conf/db')

const appNotice = (content) => {
	console.log('通知操作')

	const users = db.get('t_user')
		  notice = db.get('t_notice')

	users.find({flag: 1}, '-flag')
	.then((result)=>{
		if(result){
			async.eachSeries(result, function(item, callback){
				notice.insert({
					userId: item._id.toString(),
					content: content,
					haveRead: 0
				}).then((result) => {
					callback()
				})
			},function(err, result){
				console.info('App版本更新通知成功')
			})
		}else{
			console.error('app版本变更通知：', '遍历用户表失败')
		}
	})
	.catch((error)=>{
		console.error('app版本变更通知：', error)
	})
}

module.exports = appNotice