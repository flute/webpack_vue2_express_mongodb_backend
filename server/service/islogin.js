const islogin = (req, res, next) => {
	// 检测是否登录
	if( req.session.user && req.session.permission ){
		res.json({
			status: 1,
			msg: '已登录',
			userinfo: req.session.user,
			permission: req.session.permission
		})
		next()
	}else{
		res.json({
			status: 0,
			msg: '未登录233'
		})
	}
}

module.exports = islogin