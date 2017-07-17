const db = require('../conf/mongodb')
const checkSign = require('../services/checkSign')
const bill = require('../conf/config').bill 

const service = db.get('t_client_service')

const renewalService = (req, callback) => {

	const isSignAvailable = checkSign(req)
	if( isSignAvailable.status === 0 ){
		callback({
			status: 0,
			msg: isSignAvailable.msg
		})
		return
	}

	let serviceId = req.body.serviceId,
		serviceYear = req.body.serviceYear

	if( !serviceId || !serviceYear ){
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
				callback({
					status: 0,
					msg: '服务未处于开通状态，无法续费'
				})
			}else{
				let date = new Date(result.endTime)
				let endTime = ( date.getFullYear()+Number(serviceYear) )+'-'+(date.getMonth()+1)+'-'+date.getDate()
				endTime = new Date(endTime)

				let settle = serviceYear * 12 * bill.price * result.userNum
					settle = settle<2000 ? 2000 : settle
				let difference = settle - result.settle

				service.update({_id: serviceId},{
					clientId : result.clientId,
				    startTime : result.startTime,
				    endTime : result.endTime,
				    userNum : result.userNum,
				    createAt : result.createAt,
				    closeAt : null,
				    status : 2,
				    month: result.month,
				    settle: result.settle,
				    difference: result.difference,
				    differenceWith: result.differenceWith,
				    first: result.first,
				}).then((res) => {
					if(res){
						
						service.insert({
							clientId: result.clientId,
							startTime: result.endTime,
							endTime: endTime,
							userNum: result.userNum,
							createAt: new Date(),
							closeAt: null,
							status: 1,
							month: result.month,
							settle: settle,
							difference: difference,
							differenceWith: result.serviceId,
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

module.exports = renewalService