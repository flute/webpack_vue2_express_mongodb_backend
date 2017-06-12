const db = require('../../conf/db')

const createVersion = (req, callback) => {

	let desc = req.body.desc,
		name = req.body.name,
		address = req.body.address,
		platform = req.body.selectPlatform,
		mode = req.body.selectMode,
		number = req.body.number;

	if( !desc || !name || !address || !platform || !mode ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return;
	}

	const version = db.get('t_version'),
		  time = new Date();
		  
	version.insert({
		description: desc,
		name: name,
		updateAddr: address,
		updateType: mode,
		platform: platform,
		pubStatus: 0,
		createdAt: time,
		updateAt: time,
		version: number,
		flag: 1
	}).then((result)=>{
		if( result ){
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
	}).then(() => db.close())
	.catch((error) => {
		callback({
			status: 0,
			msg: error
		})
	})
}

module.exports = createVersion