const async = require('async')
const db = require('../../conf/db')
const nodeExcel = require('excel-export');

const bill = db.get('t_bill')
let userAgent = null;

const exportBills = (req, res) => {

	userAgent = (req.headers['user-agent']||'').toLowerCase();
	let selected = req.query.p
	if( !selected || selected.length==0 ){
		return;
	}
	selected = selected.split(',')
	console.log('导出账单', selected)

	let datas = []
	let filename = ''

	async.eachSeries(selected, function(item, callback){
		bill.findOne({_id: item}, '-_id')
		.then((result) => {
			if( result ){
				datas.push([
					result.clientName,
					result.month,
					result.settle+'元'
				])
				filename = result.month+'月账单'
			}
			callback()
		})
	} ,function(err, result){
		doExport(datas, filename, res)
	})
	
}

const doExport = (datas, filename, res) => {

	let conf ={};

	conf.cols = [{
	    caption:'客户名称',
	    captionStyleIndex: 1,        
	    type:'string',
	    width:100
	},{
	    caption:'月份',
	    type:'string',
	    width:100
	},{
	    caption:'账单金额',
	    type:'string',
	    width:50
	}];

	conf.rows = datas;

	let result = nodeExcel.execute(conf);
	
	res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
	if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
	    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename) +".xlsx");
	} else if(userAgent.indexOf('firefox') >= 0) {
	    res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'.xlsx"');
	} else {
	    res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary') +".xlsx");
	}

	res.end(result, 'binary');
}
module.exports = exportBills