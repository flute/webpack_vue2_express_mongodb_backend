const islogin = (req, callback) => {
	// 检测是否登录
	if( req.session.user && req.session.permission ){
		callback({
			status: 1,
			msg: '已登录',
			userinfo: req.session.user,
			permission: req.session.permission,
			notice: req.session.notice
		})
	}else{
		callback({
			status: -1,
			msg: '未登录'
		})
	}
}

module.exports = islogin