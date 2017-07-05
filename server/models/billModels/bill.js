const async = require('async')
const db = require('../../conf/db')

const client = db.get('t_client')
const service = db.get('t_client_service')
const bills = db.get('t_bill') 

const bill = () => {
	// 遍历所有客户
	client.find({flag: 1}, '-flag')
	.then((result) => {
		if( result && result.length>0 ){

			let date = new Date()
			let year = date.getFullYear()
			let month = date.getMonth()
			let bill = []

			async.eachSeries(result, function(item, callback){
				// 查询每个客户的所有服务
				service.find({clientId: item._id.toString()}, '-status')
				.then((result) => {  console.log('clients:', result)
					if( result ){
						// 查询首次开通的服务
						service.findOne({clientId: item._id.toString(), first: true}, '-status')
						.then((res) => {
							if( res ){

								let theMonth = new Date(res.startTime).getMonth()
								let currentMonthService = []
								let difference = 0
								let price = 0

								result.forEach(function(service, index){

									let startTime = new Date(service.startTime)
									let startYear = startTime.getFullYear()
									let startMonth = startTime.getMonth()
									// 当月
									if( startYear==year && startMonth==month ){
										currentMonthService.push(service)
									}
									difference += service.difference
								})
								// 当月存在账单
								if( currentMonthService.length>0 ){
									if( currentMonthService[0].first ){
										// 当月为第一月，只取当月最后一次服务的计费值
										price = currentMonthService[currentMonthService.length-1].settle
									}else{
										// 不是第一月，只需计算差值即可
										let price = difference	
									}
									bill.push({
										clientId: item._id.toString(),
										clientName: item.name,
										month: month+1,
										settle: price
									})
								}else{
								//当月账单为零
									bill.push({
										clientId: item._id.toString(),
										clientName: item.name,
										month: month+1,
										settle: 0
									})
								}
								

							}else{
								console.info('账单结算：遍历客户的首次开通服务为空')
								bill.push({
									clientId: item._id.toString(),
									clientName: item.name,
									month: month+1,
									settle: 0
								})
							}
							callback()
						})

					}else{
						console.error('账单结算：遍历客户的服务为空')
						bill.push({
							clientId: item._id.toString(),
							clientName: item.name,
							month: month+1,
							settle: 0
						})
						callback()
					}
				})

			}, function(err, res){
				console.log('遍历客户结束', bill)
				if( bill.length>0 ){
					async.eachSeries(bill, function(item, callback){
						bills.insert({
							clientId: item.clientId,
							clientName: item.clientName,
							month: item.month,
							settle: item.settle
						}).then((result) => {
							if( result ){
								console.info('客户：'+item.clientName+'-'+item.month+'月账单插入成功（'+ item.settle +'元）')
							}else{
								console.error('客户：'+item.clientName+'-'+item.month+'月账单插入失败（'+ item.settle +'元）')
							}
							callback()
						})
					}, function(error, result){
						console.log('账单插入完成')
					})
				}

			})
		}else{
			console.error('账单结算：遍历客户为空')
		}
	})
	.catch((error) => {
		console.error('账单结算：遍历客户失败')
	})
	
}

module.exports = bill