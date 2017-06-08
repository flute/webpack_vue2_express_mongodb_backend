const async = require('async');
const db = require('../conf/db');

const getPermission = (userinfo, callback) => {
	let role = db.get('t_role'),
		perObj = {
			path: [],
			dom: [],
			name: []
		}; // 权限合集
	// 获取角色的所有权限
	async.eachSeries( userinfo.roles, function(item,cb){
		role.findOne({ename: item}, '-_id').then((result) => {	console.log('findOne role：');console.log(result)
			if( result ){
				let permission = db.get('t_permission')
				// 获取权限的所有dom
				async.eachSeries( result.permissions, function(item,cback){
					permission.findOne({ename: item}, '-_id').then((presult) => {	console.log('findOne perssion：');console.log(presult)
						if( presult ){
							perObj.dom = perObj.dom.concat( presult.dom )
							perObj.path = perObj.path.concat( presult.path )
							perObj.name.push( presult.cname )
						}
						cback()
					})
					.catch((err) => {
						if( err ){
							console.error('error：', err)
							cback(err)
						}
					})
				},function(err, result){
					if( err ){
						console.error('error：', err)
						cb(err)
					}else{
						cb();
					}
				})
			}else{
				cb()
			}
		})
		.catch((err) => {
			if( err ){
				console.error('error：', err)
				cb(err)
			}
		})	
	},function(err, results){
		if( err ){
			let data = {
				status: 0,
				msg: '未知错误'
			}
			console.error(err);
			callback(data);
			
		}else{
			let data = {
				status: 1,
				msg: 'success',
				data: userinfo,
				permission: perObj
			}
			callback(data);
		}
		//db.close();
	});
}

module.exports = getPermission