
const rbac = (req, res, next) => {
	// RBAC权限检验
	console.log('Time：', Date.now());
	console.log('originalUrl：'+req.originalUrl)
	console.log('baseUrl：'+req.baseUrl)
	console.log('path：'+req.path)
	console.log(req.session.user)
	console.log(req.session.permission)

	const pathArr = ['/agent/new','/agent/list','/mongo/list','/mongo/insert','/mongo/update','/mongo/remove'];

	if( pathArr.indexOf(req.path)>=0 ){
		// 需授权的合法路由
		if( req.session.user && req.session.permission ){
			//console.log(req)
			let permission = req.session.permission.path;
			if( permission.indexOf(req.path)>=0 ){
				// 有权限
				next()
			}else{
				// 无权限
				res.json({
					status: 0,
					msg: 'permission denied!'
				})
			}
		}else{
			// permission denied
			res.json({
				status: 0,
				msg: '未登陆'
			})
		}
	}else{
		// 无需授权路径
		next()
	}

}

module.exports = rbac