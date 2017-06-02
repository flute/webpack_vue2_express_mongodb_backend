//var express = require('express');
//var router = express.Router();

//const RBAC = require('../lib/rbac.js');
const RBAC = require('../lib/rbac');

const crypto = require('crypto')

const db = require('monk')('localhost:27017/backend')
const posts = db.get('posts');

function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

module.exports = function(app){

	app.use(RBAC);
	// 登陆
	app.post('/login', function(req, res, next){
		let account = req.body.account,
			pwd = req.body.pwd;

		const user = db.get('user');
		user.findOne({account: account}).then((userinfo)=>{
			console.log(userinfo)
			if( md5(pwd) == userinfo.pwd ){
				let data = {
					status: 1,
					msg: 'success',
					data: userinfo
				}
				res.json(data);
			}else{
				let data = {
					status: 0,
					msg: 'wrong password'
				}
				res.json(data);
			}
		}).then(() => db.close())
	})
	// 新增代理
	app.post('/agent/new', function(req, res, next){
		let account = req.body.account,
			name = req.body.name,
			pwd = req.body.pwd,
			admin = req.body.admin;

		const user = db.get('user');
		user.findOne({account: account}).then((userinfo)=>{
			if(!userinfo){
				user.findOne({account: admin}).then((adminInfo)=>{
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
		users.find({}).each((user, {close, pause, resume}) => {
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

	app.get('/list', function(req, res, next){
		posts.find({}).then((result) => {
			//console.log(result);
			res.json(result);
		}).then(() => db.close())
	})

	app.get('/insert', function(req, res, next){
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

	app.get('/update', function(req, res, next){
		posts.update({name: 'bob'}, {name: 'stack'}).then((result)=>{
			res.json(result)
		}).then(() => db.close())
	})

	app.get('/remove', function(req, res, next){
		posts.remove({name: 'stack'}).then((result)=>{
			res.json(result)
		}).then(() => db.close())
	})
}