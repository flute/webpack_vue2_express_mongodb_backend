const rbac = (req, res, next) => {
	// RBAC权限检验
	console.log('Time:', Date.now());
	next()
}

export default rbac