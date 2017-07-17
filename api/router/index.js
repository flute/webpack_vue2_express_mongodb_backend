// models
const openService = require('../models/openService')
const changeServiceUserNum = require('../models/changeServiceUserNum')
const renewalService = require('../models/renewalService')
const changePassword = require('../models/changePassword')
const updateClient = require('../models/updateClient')

module.exports = function(server) {
    server.post('/api/service/open', function(req, res, next){
        openService(req, function(result){
            res.json(result)
        })
    })

    server.post('/api/service/usernum', function(req, res, next){
        changeServiceUserNum(req, function(result){
            res.json(result)
        })
    })

    server.post('api/service/renewal', function(req, res, next){
        renewalService(req, function(result){
            res.json(result)
        })
    })

    server.post('api/account/changepwd', function(req, res, next){
        changePassword(req, function(result){
            res.json(result)
        })
    })

    server.post('api/client/update', function(req, res, next){
        updateClient(req, function(result){
            res.json(result)
        })
    })
};
