const express = require('express');
const router = express.Router();
// models
const getVersionList = require('../models/VersionModels/getVersionList'),
	  createVersion = require('../models/VersionModels/createVersion'),
	  updateVersion = require('../models/VersionModels/updateVersion'),
	  removeVersion = require('../models/VersionModels/removeVersion'),
	  publishVersion = require('../models/VersionModels/publishVersion');

router.get('/list', function(req, res) {
	getVersionList(req, function(result){
		res.json(result)
	});
});
router.post('/new', function(req, res) {
	createVersion(req, function(result){
		res.json(result);
	});
});
router.post('/update', function(req, res) {
	updateVersion(req, function(result){
		res.json(result);
	});
});
router.post('/remove', function(req, res) {
	removeVersion(req, function(result){
		res.json(result);
	});
});
router.post('/publish', function(req, res) {
	publishVersion(req, function(result){
		res.json(result);
	});
});

module.exports = router;