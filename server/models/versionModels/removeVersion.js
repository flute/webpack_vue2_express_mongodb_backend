const db = require('../../conf/db')

const removeVersion = (req, callback) => {

	let id = req.body.id;

	if( !id ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const version = db.get('t_version');

	version.findOne({_id: id}, '-_id').then((result) => {
		if(result){
			version.update({_id: id}, {
				description: result.description,
				name: result.name,
				updateAddr: result.updateAddr,
				platform: result.platform,
				updateType: result.updateType,
				version: result.version,
				createdAt: result.createdAt,
				updateAt: result.updateAt,
				pubStatus: result.pubStatus,
				flag: 0,
			}).then((result) => {
				if(result){
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
			}).catch((error) => {
				callback({
					status: 0,
					msg: error
				})
			})

			let key = result.platform=='ios'?'version-asistant-ios':'version-asistant-android'
			if( result.pubStatus === 1 ){
				// redis
				redis.select('2', function(error){
				    if(error){
				        console.error('redis update version failed:', error);
				    }else{
				        redis.get(key, function(err, reply){
				    		reply = JSON.parse(reply)
				    		if( reply && reply._id==result._id.toString() ){
				    			redis.del(key, function(err, res){  
							        console.log('redis delete :'+key+'——'+result.description, res);  
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
	}).catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = removeVersion