//var express = require('express');
//var router = express.Router();
const crypto = require('crypto');
const async = require('async');
const db = require('monk')('localhost:27017/operate');
const RBAC = require('../lib/rbac');
const Islogin = require('../service/islogin');
const getAllPermission = require('../service/getAllPermission');
const slugify = require('transliteration').slugify

function md5 (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

module.exports = function(app){

	app.use(RBAC)

	app.get('/islogin', Islogin)
	
	app.get('/logout', function(req, res, next){
		req.session.user = null
		req.session.permission = null
		res.json({
			status: 1,
			msg: 'logout success'
		})
	})
	// 登陆
	app.post('/login', function(req, res, next){
		let account = req.body.account,
			pwd = req.body.pwd;

		const user = db.get('t_user');
		user.findOne({account: account}, '-_id').then((userinfo)=>{
			if( userinfo ){
				console.log('userinfo', userinfo)
				if( md5(pwd) == userinfo.pwd ){
					getAllPermission(userinfo, function(result){
						console.log('Result：', result)
						if( !result.status ){
							res.json(result);
						}else{
							req.session.user = userinfo;
							req.session.permission = result.permission;
							console.info('session：',req.session)
							res.json(result);
						}
					})
					
				}else{
					let data = {
						status: 0,
						msg: 'wrong password'
					}
					res.json(data);
				}
			}else{
				// 没有此用户
				let data = {
					status: 0,
					msg: 'no user'
				}
				res.json(data);
			}
		})
		.catch((err) => {
			if(err){
				console.log(err)
				res.json({status: 0, msg: '发生未知错误'})
			}
		})
		//.then(() => db.close())
	})


	// 新增角色
	app.get('/role/list', function(req, res, next){	
		
		const roles = db.get('t_role');
		const permissions = db.get('t_permission');

		roles.find({flag: 1}, '-_id').then((result) => { console.log('index.js:85', result)
			if( result ){
				let rolesArr = []; // 权限合集
				async.eachSeries( result, function(item, callback){
					item.perObj = {
						path: [],
						dom: [],
						name: []
					};
					async.eachSeries( item.permissions, function( pername, cb ){
						permissions.findOne({ename: pername}, '-_id').then((perresult)=>{ console.log('index.js 95:', perresult)
							if( perresult ){
								item.perObj.dom = item.perObj.dom.concat( perresult.dom )
								item.perObj.path = item.perObj.path.concat( perresult.path )
								item.perObj.name.push( perresult.cname )
							}
							cb();
						}).catch((error)=>{ cb(error) })
					},function(err, result){
						rolesArr.push(item)
						callback(err, result)
					})					
				},function(err, result){ console.log('index.js:116', err, result, rolesArr)
					if( err ){
						res.json({
							status: 0,
							msg: err
						})
					}else{
						permissions.find({}, '-_id').then((result)=>{
							if( result ){
								res.json({
									status: 1,
									msg: 'success',
									data: rolesArr,
									permissions: result
								})
							}else{
								res.json({
									status: 0,
									msg: '未查找到许可信息'
								})
							}
							db.close();
						})

					}
					
				})
			}else{
				res.json({
					status: 0,
					msg: 'users empty'
				})
			}
		})

	})

	app.post('/role/new', function(req, res, next){
		let name = req.body.name,
			permission = req.body.permission;

		if( !name || !permission || permission.length==0 ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}

		const role = db.get('t_role')
		role.insert({
			cname: name,
			ename: slugify(name),
			permissions: permission,
			flag: 1
		}).then((result)=>{
			if( result ){
				res.json({
					status: 1,
					msg: 'success'
				})
			}else{
				res.json({
					status: 0,
					msg: '新增失败'
				})
			}
		}).then(() => db.close())
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})

	app.post('/role/remove', function(req, res, next){
		let name = req.body.name;

		if( !name ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}
		const role = db.get('t_role')
		role.findOne({ename: name}, '-_id').then((result) => {
			if( result ){
				result.flag = 0;
				role.update({ename: name}, result).then((result)=>{
					if( result ){
						res.json({
							status: 1,
							msg: 'success'
						})
					}else{
						res.json({
							status: 0,
							msg: '删除失败'
						})
					}
				}).then(() => db.close())
			}else{
				res.json({
					status: 0,
					msg: '未找到该角色'
				})
			}
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})


	app.post('/role/update', function(req, res, next){
		let oldname = req.body.oldname,
			newname = req.body.newname,
			permission = req.body.permission;

		if( !oldname || !newname || !permission || permission.length==0 ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}
		const role = db.get('t_role')
		const data = {
			cname: newname,
			ename: slugify(newname),
			permissions: permission,
			flag: 1
		}

		role.update({ename: oldname}, data).then((result)=>{
			if( result ){
				res.json({
					status: 1,
					msg: 'success'
				})
			}else{
				res.json({
					status: 0,
					msg: '更新失败'
				})
			}
		}).then(() => db.close())
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})

	app.get('/user/list', function(req, res, next){

		const users = db.get('t_user');
		const admin = req.session.user.account;

		users.find({flag: 1}, '-_id')
		.then((result)=>{
			if( result ){
				let data = [];
				for( let i=0;i<result.length;i++ ){
					// 如果是上级，有权查看，否则无
					if( result[i].parents.indexOf(admin)>=0 ){
						data.push(result[i])
					}
				}
				res.json({
					status: 1,
					msg: 'success',
					data: data
				})
			}else{
				res.json({
					status: 0,
					msg: "未找到用户"
				})
			}
		})
		.catch((error)=>{
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})


	app.post('/user/new', function(req, res, next){
		let name = req.body.name,
			account = req.body.account,
			pwd = req.body.pwd,
			roles = req.body.roles,
			creator = req.session.user.account;

		if( !name || !account || !pwd || !roles || roles.length==0 ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}

		const user = db.get('t_user')
		user.findOne({account: creator}, '-_id').then((result)=>{
			if( result ){
				// 代理级数控制
				if( result.parents.length == 9 ){
					res.json({
						status: 0,
						msg: '最多为十级代理，如需开通，请联系管理人员'
					})
					return;
				}
				// 父级创建者记录
				let parents = result.parents
					parents.push(result.account)
				user.insert({
					name: name,
					account: account,
					pwd: md5(pwd),
					roles: roles,
					parents: parents,
					flag: 1
				}).then((result)=>{
					if( result ){
						res.json({
							status: 1,
							msg: 'success'
						})
					}else{
						res.json({
							status: 0,
							msg: '新增失败'
						})
					}
				}).then(() => db.close())
				.catch((error) => {
					res.json({
						status: 0,
						msg: error
					})
				})
			}else{
				res.json({
					status: 0,
					msg: '未找到创建者'
				})
			}
		}).catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})

	})


	app.post('/user/remove', function(req, res, next){

		const account = req.body.account;
		const creator = req.session.user.account;
		const users = db.get('t_user');
		if( !account ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}
		users.findOne({account: account}, '-_id')
		.then((result)=>{
			if( result ){
				if( result.parents.indexOf(creator)>=0 ){
					// 父级代理，有权删除
					result.flag = 0;
					users.update({account: account}, result).then((result)=>{
						if( result ){
							res.json({
								status: 1,
								msg: 'success'
							})
						}else{
							res.json({
								status: 0,
								msg: '删除失败'
							})
						}
					}).then(() => db.close())
				}else{
					res.json({
						status: 0,
						msg: '没有权限'
					})
				}
			}else{
				res.json({
					status: 0,
					msg: "未找到用户"
				})
			}
		})
		.catch((error)=>{
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})

	
	app.post('/user/update', function(req, res, next){
		let name = req.body.name
			account = req.body.account,
			pwd = req.body.pwd,
			roles = req.body.roles,
			creator = req.session.user.account;

		if( !name || !account || !pwd || !roles || roles.length==0 ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}

		const users = db.get('t_user')
		users.findOne({account:  account}, '-_id')
		.then((result) => {
			if( result ){
				if( result.parents.indexOf( creator )>=0 ){
					let data = {
						account: account,
						name: name,
						pwd: md5(pwd),
						roles: roles,
						parents: result.parents,
						flag: result.flag
					}
					users.update({account: account}, data)
					.then((result) => {
						if( result ){
							res.json({
								status: 1,
								msg: 'success'
							})
						}else{
							res.json({
								status: 0,
								msg: '更新失败'
							})
						}
					})
					.catch((error) => {
						res.json({
							status: 0,
							msg: error
						})
					})
					.then(() => db.close())
				}else{
					res.json({
						status: 0,
						msg: '没有权限'
					})
				}
			}else{
				res.json({
					status: 0,
					msg: '未找到该用户'
				})
			}
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})



	app.get('/client/list', function(req, res, next){

		const client = db.get('t_client');
		const user = db.get('t_user');
		const admin = req.session.user.account;

		client.find({flag: 1}, '-_id')
		.then((result) => {
			if( result ){
				let datas = [];
				async.eachSeries(result, function(item, callback){
					// 本人是客户的管理员
					if( item.user == admin ){
						item.username = req.session.user.name
						datas.push( item )
						callback()
					}else{
						user.findOne({account: item.user}, '-_id')
						.then((result) => {
							if( result ){
								if( result.parents.indexOf( admin )>=0 ){
									// 如果是 客户绑定的管理员 的父级，有权查看
									item.username = result.name
									datas.push( item )
								}
							}
							callback()
						})
						.catch((err) => {
							callback(err)
						})
					}
				},function(err, result){
					if( err ){
						res.json({
							status: 0,
							msg: err
						})
					}else{
						res.json({
							status: 1,
							msg: 'success',
							data: datas
						})
					}
				})
			}else{
				res.json({
					status: 0,
					msg: '查询客户失败'
				})
			}
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
		
	})


	app.post('/client/new', function(req, res, next){
		let name = req.body.name,
			phone = req.body.phone,
			address = req.body.address,
			user = req.body.user;

		if( !name || !phone || !address || !user ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}

		const client = db.get('t_client')
		client.insert({
			cname: name,
			ename: slugify(name),
			phone: phone,
			address: address,
			user: user,
			flag: 1
		})
		.then((result) => {
			if( result){
				res.json({
					status: 1,
					msg: 'success'
				})
			}else{
				res.json({
					status: 0,
					msg: '新增失败'
				})
			}
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
	})


	app.post('/client/remove', function(req, res, next){
		const name = req.body.name;
		const admin = req.session.user.account;
		const client = db.get('t_client');
		const user = db.get('t_user');

		client.findOne({ename: name}, '-_id')
		.then((result) => {
			if( result ){
				let data = {
					cname: result.cname,
					ename: result.ename,
					user: result.user,
					phone: result.phone,
					address: result.address,
					flag: 0
				}
				// 判断是否权限删除
				if( result.user == admin ){
					client.update({ename: name}, data)
					.then((result) => {
						if( result ){
							res.json({
								status: 1,
								msg: 'success'
							})
						}else{
							res.json({
								status: 0,
								msg: '删除失败'
							})
						}
					})
					.catch((error) => {
						res.json({
							status: 0,
							msg: error
						})
					})
				}else{
					user.findOne({account: result.user}, '-_id')
					.then(( result ) => {
						if( result ){
							if( result.parents.indexOf(admin)>= 0 ){
								client.update({ename: name}, data)
								.then((result) => {
									if( result ){
										res.json({
											status: 1,
											msg: 'success'
										})
									}else{
										res.json({
											status: 0,
											msg: '删除失败'
										})
									}
								})
								.catch((error) => {
									res.json({
										status: 0,
										msg: error
									})
								})
							}else{
								re.json({
									status: 0,
									msg: '没有权限'
								})
							}
						}else{
							res.json({
								status: 0,
								msg: '未找到客户绑定的用户'
							})
						}
					})
				}
			}else{
				res.json({
					status: 0,
					msg: '未找到该客户'
				})
			}	
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})
	})


	app.post('/client/update', function(req, res, next){
		let name = req.body.name,
			phone = req.body.phone,
			address = req.body.address,
			user = req.body.user,
			admin = req.session.user.account;
		if( !name || !phone || !address || !user || !admin ){
			res.json({
				status: 0,
				msg: '参数错误'
			})
			return;
		}
		
		const client = db.get('t_client');
		const users = db.get('t_user');
		ename = slugify(name);
		client.findOne({ename: ename}, '-_id')
		.then((result) => {
			if( result ){
				let data = {
					cname: name,
					ename: ename,
					phone: phone,
					address: address,
					user: user,
					flag: result.flag
				}
				if( result.user == admin ){
					client.update({ename: ename}, data)
					.then((result) => {
						if( result ){
							res.json({
								status: 1,
								msg: 'success'
							})
						}else{
							res.json({
								status: 0,
								msg: '更新失败'
							})
						}
					})
					.catch((error) => {
						res.json({
							status: 0,
							msg: error
						})
					})
				}else{
					users.findOne({account: result.user}, '-_id')
					.then((result) => {
						if( result ){
							if( result.parents.indexOf(admin)>=0 ){
								client.update({ename: ename}, data)
								.then((result) => {
									if( result ){
										res.json({
											status: 1,
											msg: 'success'
										})
									}else{
										res.json({
											status: 0,
											msg: '更新失败'
										})
									}
								})
								.catch((error) => {
									res.json({
										status: 0,
										msg: error
									})
								})
							}else{
								res.json({
									status: 0,
									msg: '没有权限'
								})
							}
						}else{
							res.json({
								status: 0,
								msg: '未找到该客户绑定的用户'
							})
						}
					})
				}
			}else{
				res.json({
					status: 0,
					msg: '未找到该客户' 
				})
			}
		})
		.catch((error) => {
			res.json({
				status: 0,
				msg: error
			})
		})

	})

}