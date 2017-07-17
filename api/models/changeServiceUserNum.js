const db = require('../conf/mongodb')
const checkSign = require('../services/checkSign')
const bill = require('../conf/config').bill 

const service = db.get('t_client_service')

const changeServiceUserNum = (req, callback) => {

	const isSignAvailable = checkSign(req)
	if( isSignAvailable.status === 0 ){
		callback({
			status: 0,
			msg: isSignAvailable.msg
		})
		return
	}

	let serviceId = req.body.serviceId,
		userNum = req.body.userNum

	if( !serviceId || !userNum ){
		callback({
			status: 0,
			msg: '参数错误'
		})
		return
	}

	service.findOne({_id: serviceId}, '-_id')
	.then((result) => {
		if( result ){
			if( result.status != 1 ){
				service.update({_id: serviceId},{
					clientId : result.clientId,
				    startTime : result.startTime,
				    endTime : result.endTime,
				    userNum : userNum,
				    createAt : result.createAt,
				    closeAt : result.closeAt,
				    status : result.status,
				    month: result.month,
				    settle: result.settle,
				    difference: result.difference,
				    differenceWith: result.differenceWith,
				    first: result.first,
				}).then((res) => {
					if( res ){
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
				})
			}else{
				let serviceYear = new Date(result.endTime).getFullYear() - new Date(result.startTime).getFullYear()
				let settle = serviceYear * 12 * bill.price * userNum
					settle = settle<2000 ? 2000 : settle
				let difference = settle - result.settle

				service.update({_id: serviceId},{
					clientId : result.clientId,
				    startTime : result.startTime,
				    endTime : result.endTime,
				    userNum : result.userNum,
				    createAt : result.createAt,
				    closeAt : null,
				    status : 3,
				    month: result.month,
				    settle: result.settle,
				    difference: result.difference,
				    differenceWith: result.differenceWith,
				    first: result.first,
				}).then((res) => {
					if(res){
						service.insert({
							clientId: result.clientId,
							startTime: result.startTime,
							endTime: result.endTime,
							userNum: userNum,
							createAt: new Date(),
							closeAt: null,
							status: 1,
							month: result.month,
							settle: settle,
							difference: difference,
							differenceWith: serviceId,
							pauseResume: result.pauseResume
						}).then((result) => {
							if(result){
								callback({
									status: 1,
									msg: 'success'
								})
							}else{
								callback({
									status: 0,
									msg: '变更失败'
								})
							}
						}).catch((error) => {
							callback({
								status: 0,
								msg: error
							})
						})
					}else{
						callback({
							status: 0,
							msg: '变更失败'
						})
					}
				})

			}
		}else{
			callback({
				status: 0,
				msg: '未找到该服务'
			})
		}
	}) 

}

module.exports = changeServiceUserNum