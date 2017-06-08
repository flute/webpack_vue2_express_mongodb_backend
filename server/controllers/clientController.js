var express = require('express');
var router = express.Router();
// models
var getClientList = require('../models/clientModels/getClientList'),
	createClient = require('../models/clientModels/createClient'),
	updateClient = require('../models/clientModels/updateClient');
	removeClient = require('../models/clientModels/removeClient')

router.get('/list', function(req, res) {
	getClientList(req, function(result){
		res.json(result)
	});
});
router.post('/new', function(req, res) {
	createClient(req, function(result){
		res.json(result);
	});
});
router.post('/update', function(req, res) {
	updateClient(req, function(result){
		res.json(result);
	});
});
router.post('/remove', function(req, res) {
	removeClient(req, function(result){
		res.json(result);
	});
});

module.exports = router;