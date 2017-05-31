//var express = require('express');
//var router = express.Router();

//import RBAC from '../lib/rbac.js';
//const RBAC = require('../lib/rbac');

const db = require('monk')('localhost:27017/blog')
const posts = db.get('posts');


module.exports = function(app){

	//app.use(RBAC);

	/*app.get('/', function(req, res, next){
	  	//res.render('index', { title: 'Express' });
	  	res.json({ title: 'Express' })
	})*/

	app.get('/list', function(req, res, next){
		posts.find({}).then((result) => {
			console.log(result);
			res.json(result);
		})
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
		})
	})

	app.get('/update', function(req, res, next){
		posts.update({name: 'bob'}, {name: 'stack'}).then((result)=>{
			res.json(result)
		})
	})

	app.get('/remove', function(req, res, next){
		posts.remove({name: 'stack'}).then((result)=>{
			res.json(result)
		})
	})
}