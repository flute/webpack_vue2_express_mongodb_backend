const express = require('express');
const router = express.Router();
// models
const getUserList = require('../models/userModels/getUserList'),
	  createUser = require('../models/userModels/createUser'),
	  updateUser = require('../models/userModels/updateUser');
	  removeUser = require('../models/userModels/removeUser')

router.get('/list', function(req, res) {
	getUserList(req, function(result){
		res.json(result)
	});
});
router.post('/new', function(req, res) {
	createUser(req, function(result){
		res.json(result);
	});
});
router.post('/update', function(req, res) {
	updateUser(req, function(result){
		res.json(result);
	});
});
router.post('/remove', function(req, res) {
	removeUser(req, function(result){
		res.json(result);
	});
});

module.exports = router;