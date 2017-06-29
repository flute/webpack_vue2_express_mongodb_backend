const async = require('async')
const waterfall = require('async/waterfall') ;

const mysql = require('mysql')
const conf = require('../conf/mysql')
const pool = mysql.createPool( conf.mysql )

const crypto = require('crypto')
const md5 = text => crypto.createHash('md5').update(text).digest('hex')

module.exports = function(data, calls){

	pool.getConnection(function(err, connection){
		if( err ){
			console.error('mysql connected error:', err)
			calls({
				status: 0,
				msg: 'mysql connected failed'
			})
			// 连接失败
			return;
		}else{
			async.waterfall([
				// t_sys_role
			    function(callback) {
			    	connection.query("select id from t_admin where tenantId='"+data.clientid+"'", function(err, res){
			    		console.info('check client is already inited:', err, res)
			    		if( err ){
			    			callback(err)
			    		}else{
			    			if( res && res.length>0 ){
			    				calls({
				    				status: 2,
				    				msg: 'client already exist!'
				    			})
				    			return;
			    			}else{
			    				connection.query("select id from t_admin where account='"+data.account+"'", function(err, result){
						    		console.log('check account is already existed:',err, result)
						    		if( err ){
						    			callback(err)
						    		}else if( result && result.length>0 ){
						    			calls({
						    				status: 3,
						    				msg: 'account already exist!'
						    			})
						    			return;
						    		}else{
						    			connection.query('select id from t_sys_menu', function (error, results) {
								        	console.info('select t_sys_menu finished:', error)
											if( error ){
												callback(error)
											}else{
												let arr = results.map(function(item){
													return item.id
												})
												arr = arr.join(',')
												let t_sys_role = {
													createdAt: new Date(),
													updatedAt: new Date(),
													FDAT_SCOPE: 0,
													FMENU_PRIVILEGE: arr,
													FNAME: '管理员',
													tenantId: data.clientid,
													code: '000',
													del: 0
												}
												connection.query('insert into t_sys_role set ?', t_sys_role, function (error, result) {
													console.info('init t_sys_role finished:', error, result)
													callback(error, result.insertId);
												});
											}
										});

						    		}
						    	})
			    			}	
			    		}
			    	})
			    },
				// t_admin
			    function(roleId, callback) {
			    	let t_admin = {
			    		createdAt: new Date(),
			    		tenantId: data.clientid,
			    		updatedAt: new Date(),
			    		account: data.account,
			    		cellPhone: null,
			    		deptId: 1,
			    		email: null,
			    		gender: 1,
			    		icon: null,
			    		name: '管理员',
			    		password: md5(data.pwd),
			    		regionId: 3,
			    		roleId: roleId,
			    		status: 0,
			    		code: '000',
			    		del: 0
			    	}
			    	connection.query('insert into t_admin set ?', t_admin, function (error, result) {
			    		console.info('t_admin init finished:', error, result)
						callback(error, result.insertId);
					});
			    },
			    // t_config
			    function(adminId, callback) {
			        let t_config = {
			        	createdAt: new Date(),
			        	updatedAt: new Date(),
			        	tenantId: data.clientid,
			        	signin: new Date('1970-01-01 09:00:00'),
			        	signout: new Date('1970-01-01 18:00:00'),
			        	title: '好氛围',
			        	flexTime: 15,
			        	code: '000',
			        	del: 0
			        }
			        connection.query('insert into t_config set ?', t_config, function (error, result) {
			        	console.info('init t_config finished:', error, result)
						callback(error, adminId);
					});
			    },
			    // t_module
			    function(adminId, callback) {
			    	let modules = [{
			    		name: '企业文化',
			    		type: 6
			    	},{
			    		name: '优秀团队',
			    		type: 3
			    	},{
			    		name: '公司相册',
			    		type: 1
			    	},{
			    		name: '公司要闻',
			    		type: 2
			    	},{
			    		name: '亮点员工',
			    		type: 4
			    	}]
			        let t_config = {
			        	createdAt: new Date(),
			        	updatedAt: new Date(),
			        	tenantId: data.clientid,
			        	adminId: adminId,
			        	category: 0,
			        	image: null,
			        	name: null,
			        	parentId: 10,
			        	referenceUrl: null,
			        	sort: 0,
			        	status: 0,
			        	code: '000',
			        	del: 0,
			        	type: 0
			        }
			        let moduleId = null
			        async.eachSeries(modules, function(item, cb){
			        	t_config.name = item.name
			        	t_config.type = item.type
			        	connection.query('insert into t_module set ?', t_config, function(error, result){
			        		if(item.name == '公司相册'){
			        			moduleId = result.insertId
			        		}
			        		cb(error, result)
			        	})
			        },function(err, res){
			        	console.info('init t_module finished:', err, moduleId)
			        	callback(err, moduleId, adminId)
			        })
			        
			    },
			    // t_info
			    function(moduleId, adminId, callback) {
			    	let infos = [{
			    		title: '轮播图1',
			    		resourcePath: 'http://static.zxwave.com:9999/upload/images/201703/98281490167872076.jpg',
			    		resourceThumb: 'http://static.zxwave.com:9999/upload/images/201703/thumb_98281490167872076.jpg'
			    	},{
			    		title: '轮播图2',
			    		resourcePath: 'http://static.zxwave.com:9999/upload/images/201703/4901490167844617.jpg',
			    		resourceThumb: 'http://static.zxwave.com:9999/upload/images/201703/thumb_4901490167844617.jpg'
			    	},{
			    		title: '轮播图3',
			    		resourcePath: 'http://static.zxwave.com:9999/upload/images/201703/80551490167818804.jpg',
			    		resourceThumb: 'http://static.zxwave.com:9999/upload/images/201703/thumb_80551490167818804.jpg'
			    	}]
			        let t_info = {
			        	createdAt: new Date(),
			        	updatedAt: new Date(),
			        	tenantId: data.clientid,
			        	code: '000',
			        	del: 0,
			        	adminId: adminId,
			        	content: '',
			        	isTop: 0,
			        	moduleId: moduleId,
			        	reference: 0,
			        	referenceUrl: null,
			        	resourceName: null,
			        	resourcePath: null,
			        	resourceThumb: null,
			        	status: 0,
			        	title: null,
			        	remark: null,
			        	departmentId: 0,
			        	creator: null
			        }
			        async.eachSeries(infos, function(item, cb){
			        	t_info.title = item.title
			        	t_info.resourcePath = item.resourcePath
			        	t_info.resourceThumb = item.resourceThumb
			        	connection.query('insert into t_info set ?', t_info, function(error, result){
			        		cb(error, result)
			        	})
			        },function(err, res){
			        	console.info('init t_info fineshed:', err)
			        	callback(err)
			        })
			    },
			    // t_department
			    function(callback) {
			        let t_department = {
			        	createdAt: new Date(),
			        	updatedAt: new Date(),
			        	tenantId: data.clientid,
			        	code: '000',
			        	del: 0,
			        	name: '董事会办公室',
			        	pid: 10,
			        	sort: 0,
			        	category: 0,
			        	userId: 0
			        }
			        connection.query('insert into t_department set ?', t_department, function (error, result) {
			        	console.info('init t_department finished:', error, result)
						callback(error, result);
					});
			    }
			], function (err, result) {
				if( err ){
					console.error('mysql初始化失败！', err)
					
					// init failed, delete data has inserted
					let delSql = [
					"delete from t_admin where tenantId='"+data.clientid+"'",
					"delete from t_sys_role where tenantId='"+data.clientid+"'",
					"delete from t_config where tenantId='"+data.clientid+"'",
					"delete from t_module where tenantId='"+data.clientid+"'",
					"delete from t_info where tenantId='"+data.clientid+"'",
					"delete from t_department where tenantId='"+data.clientid+"'",
					]
					async.eachSeries(delSql, function(sql, cb){
						connection.query(sql,function(error, result){
							cb(error, result)
						})
					},function(err, result){
						console.info('delete finished:', error)
					})

					calls({
						status: 0,
						msg: err
					})
				}else{
					console.info('mysql初始化完毕')
					calls({
						status: 1,
						mag: 'success'
					})
				}
			    connection.release()
			});
		}
	})
}
