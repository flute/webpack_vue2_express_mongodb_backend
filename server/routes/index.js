
//var express = require('express');
//var router = express.Router();

//const RBAC = require('../lib/rbac.js');
const RBAC = require('../lib/rbac');
const Islogin = require('../service/islogin.js')

const crypto = require('crypto')
const async = require('async');

const db = require('monk')('localhost:27017/backend')
const posts = db.get('posts');

function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

module.exports = function(app){

	//app.use(Islogin);
	
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
			console.log('account：'+account,'pwd：'+pwd)
			console.log(req.params)
		const user = db.get('user');
		user.findOne({account: account}, '-_id').then((userinfo)=>{
			if( userinfo ){
				console.log('userinfo')
				console.log(userinfo)
				if( md5(pwd) == userinfo.pwd ){

					let role = db.get('role'),
						perObj = {
							path: [],
							dom: []
						}; // 权限合集
					// 获取角色的所有权限
					async.eachSeries( userinfo.roles, function(item,cb){
						role.findOne({name: item}, '-_id').then((result) => {	console.log('findOne role：');console.log(result)
							if( result ){
								//cb(null,result)
								let permission = db.get('permission')
								// 获取权限的所有dom
								async.eachSeries( result.permissions, function(item,callback){
									permission.findOne({ename: item}, '-_id').then((presult) => {	console.log('findOne per：');console.log(presult)
										if( presult ){
											perObj.dom = perObj.dom.concat( presult.dom )
											perObj.path = perObj.path.concat( presult.path )
										}
										callback()
									})
									.catch((err) => {
										if( err ){
											callback(err)
										}
									})
								},function(err, result){
									if( err ){
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
								cb(err)
							}
						})	
					},function(err, results){
						if( err ){
							let data = {
								status: 0,
								msg: '未知错误'
							}
							res.json(data);
						}else{
							let data = {
								status: 1,
								msg: 'success',
								data: userinfo,
								permission: perObj
							}
							req.session.user = userinfo;
							req.session.permission = perObj;
							console.log('123')
							console.log(req.session.user);console.log(req.session.permission);
							console.log('456')
							res.json(data);
						}
						db.close();
					});
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
				res.json({status: 0, msg: '发生未知错误'})
			}
		})
		//.then(() => db.close())
	})

	// 新增代理
	app.post('/agent/new', function(req, res, next){
		let account = req.body.account,
			name = req.body.name,
			pwd = req.body.pwd,
			admin = req.body.admin;

		const user = db.get('user');
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
						// 未找打自身账号
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
		const users = db.get('user');
		users.find({},'-_id').each((user, {close, pause, resume}) => {
			console.log(user)
			if( user.parents.indexOf(account) >= 0 ){
				agent.push(user)
			}
			
		}).then(() => {
			res.json({
				status: 1,
				msg: 'success',
				data: agent
			})
		})
	})

	app.get('/mongo/list', function(req, res, next){
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
	})
}