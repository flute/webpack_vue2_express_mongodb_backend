const async = require('async')
const db = require('../../conf/db')

const getRoleList = (req, callback) => {

	const roles = db.get('t_role');
	const permissions = db.get('t_permission');

	roles.find({flag: 1}, '-_id').then((result) => {
		if( result ){
			let rolesArr = []; // 权限合集
			async.eachSeries( result, function(item, cback){
				item.perObj = {
					path: [],
					dom: [],
					name: []
				};
				async.eachSeries( item.permissions, function( pername, cb ){
					permissions.findOne({ename: pername}, '-_id').then((perresult)=>{
						if( perresult ){
							item.perObj.dom = item.perObj.dom.concat( perresult.dom )
							item.perObj.path = item.perObj.path.concat( perresult.path )
							item.perObj.name.push( perresult.cname )
						}
						cb();
					}).catch((error)=>{ cb(error) })
				},function(err, result){
					rolesArr.push(item)
					cback(err, result)
				})					
			},function(err, result){
				if( err ){
					callback({
						status: 0,
						msg: err
					})
					return;
				}else{
					permissions.find({}, '-_id').then((result)=>{
						if( result ){
							callback({
								status: 1,
								msg: 'success',
								data: rolesArr,
								permissions: result
							})
						}else{
							callback({
								status: 0,
								msg: '未查找到许可信息'
							})
							return;
						}
						db.close();
					})

				}
				
			})
		}else{
			callback({
				status: 0,
				msg: 'users empty'
			})
			return;
		}
	})
}

module.exports = getRoleList