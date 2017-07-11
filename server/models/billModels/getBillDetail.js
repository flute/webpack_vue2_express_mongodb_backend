const db = require('../../conf/db')

const service = db.get('t_client_service')
const bill = db.get('t_bill')

const getBillDetail = (req, callback) => {

	const admin = req.session.user._id
	const billId = req.body.id

	bill.findOne({_id: billId}, '-_id')
	.then((result) => {
		if( !result ){
			callback({
				status: 0,
				msg: '未找到当前账单'
			})
		}else{
			let clientId = result.clientId
			let month = result.month

			service.find({clientId: clientId}, {fields: { _id: 0 },sort: {createAt: -1}})
			.then((results) => {
				if(results){
					let bills = []
					results.forEach(function(item, index){
						let m = new Date(item.startTime).getMonth()
						if( month-1 == m ){
							item.billMonth = month
							bills.push(item)
						}
					})
					callback({
						status: 1,
						msg: 'success',
						data: bills
					})
				}else{
					callback({
						status: 0,
						msg: '该客户无服务信息'
					})
				}
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

module.exports = getBillDetail