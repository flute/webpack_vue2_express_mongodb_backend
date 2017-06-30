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
			version.update({_id: id}, {
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
			}).then((result) => {
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
			// notice
			if( result.pubStatus === 1 ){
				appNotice("好氛围在Android/iOS平台修改了版本（"+result.version+"），地址（"+result.updateAddr+"）")
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