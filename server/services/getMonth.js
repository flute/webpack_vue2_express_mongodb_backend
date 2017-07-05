/**
 * 计算月份
 */
const getMonth = (startTime, endTime) => {

	let start = new Date(startTime)
	let startYear = start.getFullYear()
	let startMonth = start.getMonth()
	let startDay = start.getDate()

	let end = new Date(endTime)
	let endYear = end.getFullYear()
	let endMonth = end.getMonth()
	let endDay = end.getDate()

	let month = 0
	
	// 同年
	if( startYear == endYear ){
		// 同月
		if( startMonth == endMonth ){
			month = Number( ( (endDay-startDay)/30 ).toFixed(2) )
		}else{
		// 不同月
			month = (endMonth-startMonth-1) + Number( ( (30-startDay+endDay)/30 ).toFixed(2) )
		}
	}else{
	// 不同年
		// 同月
		if( startMonth == endMonth ){
			
			if( endDay == startDay ){
			// 整12月
				month = (endYear-startYear)*12
			}else if( endDay > startDay ){
			// 满12月
				month = (endYear-startYear)*12 + Number( ( (endDay-startDay)/30 ).toFixed(2) )
			}else{
			// 不足12月
				month = (endYear-startYear)*12-1 + Number( ( (30-startDay+endDay)/30 ).toFixed(2) )
			}
		}else if( endMonth > startMonth ){
		// 大于12月
			month = (endYear-startYear)*12 + (endMonth-startMonth-1) + Number( ( (30-startDay+endDay)/30 ).toFixed(2) )
		}else{
		// 小于12月
			month = (12-startMonth-1) + (endMonth+1) + Number( ( (30-startDay+endDay)/30 ).toFixed(2) )
		}
	}

	return month
}

module.exports = getMonth