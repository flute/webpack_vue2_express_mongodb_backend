const express = require('express');
const router = express.Router();
// models
const getClientList = require('../models/clientModels/getClientList')
	  createClient = require('../models/clientModels/createClient')
	  updateClient = require('../models/clientModels/updateClient')
	  removeClient = require('../models/clientModels/removeClient')
	  getServiceList = require('../models/serviceModels/getServiceList')
	  createService = require('../models/serviceModels/createService')
	  updateService = require('../models/serviceModels/updateService')
	  removeService = require('../models/serviceModels/removeService')


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

router.post('/service/list', function(req, res) {
	getServiceList(req, function(result){
		res.json(result)
	});
});
router.post('/service/new', function(req, res) {
	createService(req, function(result){
		res.json(result);
	});
});
router.post('/service/update', function(req, res) {
	updateService(req, function(result){
		res.json(result);
	});
});
router.post('/service/remove', function(req, res) {
	removeService(req, function(result){
		res.json(result);
	});
});

module.exports = router;