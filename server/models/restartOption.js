const async = require('async')

const db = require('../conf/db')
const redis = require('../conf/redis')

const client  = db.get('t_client')
const service = db.get('t_client_service')
const version = db.get('t_version')

const restartOption = () => {
	// update client_service status into redis
	client.find({flag: 1}, '-flag')
	.then((clients) => {
		if( clients ){
			async.eachSeries(clients, function(item, callback){

				let clientId = item._id.toString()

				service.findOne({clientId: clientId, status: 1}, '-_id')
				.then((result) => {
					let status = 0
					if( result ){
						status = 1
					}
					redis.select('1', function(error){
					    if(error){
					        console.error('service restart set client:'+clientId+' failed', error);
					    }else{
					        redis.set(clientId, status, function(err, res){  
						        console.log('service restart set client:'+clientId+'['+status+']', res);  
						    });
					    }
					});
					callback()
				})

			},function(err, result){
				// 客户信息更新完毕
				console.log('服务重启,客户信息更新至redis完毕')
			})
		}else{
			console.error('服务重启,遍历客户失败')
		}
	})
	// update version status into redis
	// version-asistant-ios
	version.find({flag: 1, pubStatus: 1, platform: 'ios'}, {fields: { flag: 0 },sort: {updateAt: -1} })
	.then((iosVersions) => {

		let key = 'version-asistant-ios'
		if( iosVersions && iosVersions.length>0 ){
			let result = iosVersions[0]
			redis.select('2', function(error){
			    if(error){
			        console.error('redis update version failed:', error);
			    }else{
			        redis.set(key, JSON.stringify(result), function(err, res){  
				        console.log('redis update version :'+key+'——'+result.description, res);  
				    });
			    }
			});
		}else{
			redis.select('2', function(error){
			    if(error){
			        console.error('redis update version failed:', error);
			    }else{
			        redis.del(key, function(err, res){  
				        console.log('redis del version :'+key, res);  
				    });
			    }
			});
		}
	})
	// version-asistant-android
	version.find({flag: 1, pubStatus: 1, platform: 'android'}, {fields: { flag: 0 },sort: {updateAt: -1} })
	.then((androidVersions) => {
		let key = 'version-asistant-android'
		if( androidVersions && androidVersions.length>0 ){
			let result = androidVersions[0]
			redis.select('2', function(error){
			    if(error){
			        console.error('redis update version failed:', error);
			    }else{
			        redis.set(key, JSON.stringify(result), function(err, res){  
				        console.log('redis update version :'+key+'——'+result.description, res);  
				    });
			    }
			});
		}else{
			redis.select('2', function(error){
			    if(error){
			        console.error('redis update version failed:', error);
			    }else{
			        redis.del(key, function(err, res){  
				        console.log('redis del version :'+key, res);  
				    });
			    }
			});
		}
	})
	
}

module.exports = restartOption