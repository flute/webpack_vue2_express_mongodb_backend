### 前后端分离运营平台

前后端分离RABC角色权限控制运营平台。

前端: vue-cli + vue2 + vuex + vue-router + axios + iview + ES6

后端: express-generator + express + redis + mongndb + monk

### install

``` bash
# 安装依赖
cnpm install

# 启动vue热加载 localhost:8080
cnpm start

# 启动express后端 localhost:3000
cnpm run server

# 编译vue
npm run build
```
1. 创建 mongodb 数据库，初始化数据表位于 `static/mongodb.js`，配置数据库连接 `[server/conf/db.js]`,`[server/conf/redis.js]`,`[server/conf/mysql.js]`
2. 然后同时启动 vue 服务和 node 服务即可，分别运行与 8080 和 3000 端口。

### 项目目录

```vim
.
├── README.md
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── index.html
├── package.json
├── server      // 后端express
│   ├── app.js
│   ├── bin
│   ├── conf
│   ├── controllers
│   ├── models
│   ├── routes
│   └── services
├── src // vue
│   ├── App.vue
│   ├── assets
│   ├── components
│   ├── main.js
│   └── router
└── static
    └── mongodb.json // 初始化mongodb数据
```
### 功能

* RABC角色权限控制
* 版本管理（APP版本控制）
* 角色管理（角色、许可多对多）
* 客户管理（代理分级、数据权限）
* 用户管理（用户、角色多对多）
* 服务管理（客户服务的开通、关闭、修改、续接...）
* 消息通知（定时通知）
* 结算系统（每月定时结算，账单导出）

