const db = require('../../conf/db')
const redis = require('../../conf/redis')

const createClient = (req, callback) => {

	let name = req.body.name,
		phone = req.body.phone||'',
		address = req.body.address||'',
		user = req.body.user;

	if( !name || !user){
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
			// redis add client
			redis.select('1', function(error){
			    if(error){
			        console.error('redis select failed:', error);
			    }else{
			        redis.set(result._id.toString(), 0, function(err, res){  
				        console.log('redis add client:'+result._id.toString(), res); 
				    });
			    }
			});
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