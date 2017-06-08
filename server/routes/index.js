// controllers
const roleController = require('../controllers/roleController')
const clientController = require('../controllers/clientController')
const userController = require('../controllers/userController')
// services and models
const RBAC = require('../services/rbac')
const Islogin = require('../services/islogin')
const Login = require('../models/login')

module.exports = function(app){

	app.use(RBAC)

	app.use('/role', roleController)

	app.use('/client', clientController)

	app.use('/user', userController)

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

}