// controllers
const versionController = require('../controllers/versionController')
const roleController = require('../controllers/roleController')
const clientController = require('../controllers/clientController')
const userController = require('../controllers/userController')
const serviceController = require('../controllers/serviceController')
const billController = require('../controllers/billController')
// services and models
const RBAC = require('../services/rbac')
const Islogin = require('../services/islogin')
const Login = require('../models/login')
const HasRead = require('../models/hasread')

module.exports = function(app){

	app.use(RBAC)

	app.use('/version', versionController)

	app.use('/role', roleController)

	app.use('/client/service', serviceController)

	app.use('/client', clientController)

	app.use('/user', userController)

	app.use('/bill', billController)

	app.get('/islogin', function(req, res, next){
		Islogin(req, function(result){
			res.json(result)
		})
	})
	
	app.get('/logout', function(req, res, next){
		req.session.user = null
		req.session.permission = null
		res.json({
			status: 1,
			msg: 'logout success'
		})
	})

	app.post('/login', function(req, res, next){
		Login(req, function(result){
			res.json(result)
		})
	})

	app.post('/hasread', function(req, res, next){
		HasRead(req, function(result){
			res.json(result)
		})
	})	

}