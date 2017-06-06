//var express = require('express');
//var router = express.Router();
const crypto = require('crypto');
const async = require('async');
const db = require('monk')('localhost:27017/operate');
const RBAC = require('../lib/rbac');
const Islogin = require('../service/islogin');
const getAllPermission = require('../service/getAllPermission');
//const posts = db.get('posts');
//import { transliterate as tr, slugify } from 'transliteration';
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
		const users = db.get(t_user);
		users.find({}, '-_id')
		.then((result) => {
			if( result ){
				res.json({
					status: 1,
					msg: 'success',
					data: result
				})
			}else{
				res.json({
					status: 0,
					msg: '未找到用户'
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
		user.getOne({account: creator}, '-_id').then((result)=>{
			if( result ){
				
				user.insert({
					name: name,
					account: account,
					pwd: md5(pwd),
					roles: roles,
					parents: result.parents.push(result.account),
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





	// 新增代理
	app.post('/agent/new', function(req, res, next){
		let account = req.body.account,
			name = req.body.name,
			pwd = req.body.pwd,
			admin = req.body.admin;

		const user = db.get('t_user');
		user.findOne({account: account}, '-_id').then((userinfo)=>{
			if(!userinfo){
				user.findOne({account: admin}, '-_id').then((adminInfo)=>{
					if( adminInfo ){
						if( adminInfo.parents ){
							var p = adminInfo.parents
						}else{
							var p = []
						}
						p.push(adminInfo.account)
						console.log(p)
						user.insert({
							account: account,
							name: name,
							pwd: md5(pwd),
							roles:['company_admin'],
							parents: p
						}).then((result)=>{
							result.status = 1;
							res.json(result)
						}).then(() => db.close())
					}else{
						// 未找到自身账号
						res.json({
							status: 0,
							msg: '未找到自身账号'
						})
					}
				})
				
			}else{
				// 账户存在
				res.json({
					status: 0,
					msg: '该账号已存在'
				})
			}
		})
		
	})
	// 获取代理列表
	app.post('/agent/list', function(req, res, next){
		const account = req.body.account,
			  agent = [];
		console.log('account：'+account);
		const users = db.get('t_user');

		users.find({}, '-_id').then((result) => {
			if( result ){
				async.eachSeries( result, function(item, callback){
					// 根据parents属性确定代理层级关系
					if( item.parents.indexOf(account) >= 0 ){
						getAllPermission(item, function(result){
							console.log('listResult：', result)
							if( result.status ){
								item.permission = result.permission
								agent.push(item)
							}
							callback();
						})
					}else{
						callback();
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
							data: agent
						})
					}
					db.close();
				})
			}else{
				res.json({
					status: 0,
					msg: 'users empty'
				})
			}
		})

	})

	/*app.get('/mongo/list', function(req, res, next){
		posts.find({},'-_id').then((result) => {
			//console.log(result);
			res.json(result);
		}).then(() => db.close())
	})

	app.get('/mongo/insert', function(req, res, next){
		posts.insert({
			name: 'bob',
			time: {
		        date: new Date(),
		        year: '2017',
		        month: '2017-05',
		        day: '2017-05-31',
		        minute: '2017-05-31 14:43'
		    },
		    title: 'insert',
		    post: '666666666'
		}).then((result)=>{
			res.json(result)
		}).then(() => db.close())
	})

	app.get('/mongo/update', function(req, res, next){
		posts.update({name: 'bob'}, {name: 'stack'}).then((result)=>{
			res.json(result)
		}).then(() => db.close())
	})

	app.get('/mongo/remove', function(req, res, next){
		posts.remove({name: 'stack'}).then((result)=>{
			res.json(result)
		}).then(() => db.close())
	})*/
}