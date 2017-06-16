const express = require('express');
const router = express.Router();
// models
const getServiceList = require('../models/serviceModels/getServiceList')
	  createService = require('../models/serviceModels/createService')
	  updateService = require('../models/serviceModels/updateService')
	  removeService = require('../models/serviceModels/removeService')
	  openService = require('../models/serviceModels/openService')
	  closeService = require('../models/serviceModels/closeService')
	  changeService = require('../models/serviceModels/changeService')
	  renewalService = require('../models/serviceModels/renewalService')

router.post('/list', function(req, res) {
	getServiceList(req, function(result){
		res.json(result)
	});
});
router.post('/new', function(req, res) {
	createService(req, function(result){
		res.json(result);
	});
});
router.post('/update', function(req, res) {
	updateService(req, function(result){
		res.json(result);
	});
});
router.post('/remove', function(req, res) {
	removeService(req, function(result){
		res.json(result);
	});
});
router.post('/open', function(req, res) {
	openService(req, function(result){
		res.json(result);
	});
});
router.post('/close', function(req, res) {
	closeService(req, function(result){
		res.json(result);
	});
});
router.post('/renewal', function(req, res) {
	renewalService(req, function(result){
		res.json(result);
	});
});
router.post('/change', function(req, res) {
	changeService(req, function(result){
		res.json(result);
	});
});

module.exports = router;