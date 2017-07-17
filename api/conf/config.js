/**
 * 必须附带的请求参数
 * app_key：APP key
 * timestamp：Unix时间戳
 * sign：签名
 * 签名验证方法：将请求的参数键值按ASCII值从小到大排列，按照键+值的形式连接成字符串（如：name=bob&age=18&weight=60，按序排列拼接后为：age18namebobweight60）,
 * 将得到的字符串+Unix时间戳+app_secret连接后得到新的字符串，将其进行MD5加密即为签名sign参数。
 */
module.exports = {
	api: {
		'hfw_operate': '44caa2445c73e4503d466726291eae79'
	},
	bill: {
		price: 15, // 15元/月/人
	    limit: 13, // 小于13人，2000/年
	    minPrice: 2000 // 小于13人，2000/年
	},
	roleId: '593e41ac551ddd6af6d5f13d',
	parentId: '59361d188862e097ef9797f7'
}