const db = require('../../conf/db')
const appNotice = require('../noticeModels/appNotice')

const updateVersion = (req, callback) => {

	let id = req.body.id,
		desc = req.body.desc,
		name = req.body.name,
		address = req.body.address,
		platform = req.body.selectPlatform,
		mode = req.body.selectMode,
		number = req.body.number;

	if( !id || !desc || !name || !address || !platform || !mode || !number){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const version = db.get('t_version'),
		  time = new Date();

	version.findOne({_id: id}, '-_id')
	.then((result) => {
		if( result ){
			let data = {
				description: desc,
				name: name,
				updateAddr: address,
				platform: platform,
				updateType: mode,
				version: number,
				createdAt: result.createdAt,
				updateAt: time,
				pubStatus: result.pubStatus,
				flag: result.flag,
			}

			version.update({_id: id}, data)
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
			}).catch((error) => {
				callback({
					status: 0,
					msg: error
				})
			})
			
			let key = result.platform=='ios'?'version-asistant-ios':'version-asistant-android'
			if( result.pubStatus === 1 ){
				// notice
				appNotice("好氛围在Android/iOS平台修改了版本（"+result.version+"），地址（"+result.updateAddr+"）")
				// redis
				redis.select('2', function(error){
				    if(error){
				        console.error('redis update version failed:', error);
				    }else{
				        redis.get(key, function(err, reply){
				    		reply = JSON.parse(reply)
				    		if( reply && reply._id==result._id.toString() ){
				    			redis.set(key, JSON.stringify(data), function(err, res){  
							        console.log('redis update :'+key+'——'+result.description, res);  
							    });
				    		}else{
				    			// do nothing...
				    		}
				    	})
				    }
				});
			}
		}else{
			callback({
				status: 0,
				msg: '未找到该版本'
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

module.exports = updateVersion