var express = require('express');
var router = express.Router();
// models
var getRoleList = require('../models/roleModels/getRoleList'),
	createRole = require('../models/roleModels/createRole'),
	updateRole = require('../models/roleModels/updateRole');
	removeRole = require('../models/roleModels/removeRole')

router.get('/list', function(req, res) {
	getRoleList(req, function(result){
		res.json(result)
	});
});
router.post('/new', function(req, res) {
	createRole(req, function(result){
		res.json(result);
	});
});
router.post('/update', function(req, res) {
	updateRole(req, function(result){
		res.json(result);
	});
});
router.post('/remove', function(req, res) {
	removeRole(req, function(result){
		res.json(result);
	});
});

module.exports = router;