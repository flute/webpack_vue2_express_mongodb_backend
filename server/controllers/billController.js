const express = require('express');
const router = express.Router();
// models
const getBills = require('../models/billModels/getBills')
	  getBillDetail = require('../models/billModels/getBillDetail')
	  exportBills = require('../models/billModels/exportBills')

router.get('/list', function(req, res) {
	getBills(req, function(result){
		res.json(result)
	});
});
router.post('/detail', function(req, res) {
	getBillDetail(req, function(result){
		res.json(result)
	});
});
router.get('/export', function(req, res) {
	exportBills(req, res);
});


module.exports = router;