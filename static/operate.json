/* 
 * mongodb初始化数据
 * 数据库： operate
 * 账号/密码： 18888888888/123456
*/

/* t_user */

    {
        "name" : "超级管理员",
        "account" : "18888888888",
        "pwd" : "e10adc3949ba59abbe56e057f20f883e",
        "roles" : [ 
            "admin"
        ],
        "parents" : [],
        "flag" : 1
    }

/* t_permission */

    /* 1 */
    {
        "cname" : "版本控制",
        "ename" : "version",
        "path" : [ 
            "/version"
        ],
        "dom" : [ 
            "version"
        ],
        "flag" : 1
    }

    /* 2 */
    {
        "cname" : "角色管理",
        "ename" : "role",
        "path" : [ 
            "/role/list", 
            "/role/new", 
            "/role/remove", 
            "/role/update"
        ],
        "dom" : [ 
            "role"
        ],
        "flag" : 1
    }

    /* 3 */
    {
        "cname" : "客户管理",
        "ename" : "client",
        "path" : [ 
            "/user/list", 
            "/client/list", 
            "/client/new", 
            "/client/remove", 
            "/client/update"
        ],
        "dom" : [ 
            "client"
        ],
        "flag" : 1
    }

    /* 4 */
    {
        "cname" : "用户管理",
        "ename" : "user",
        "path" : [ 
            "/role/list", 
            "/client/list", 
            "/user/new", 
            "/user/list", 
            "/user/remove", 
            "/user/update"
        ],
        "dom" : [ 
            "user"
        ],
        "flag" : 1
    }

/* t_role */

    /* 1 */
    {
        "ename" : "admin",
        "cname" : "超级管理员",
        "permissions" : [ 
            "role", 
            "client", 
            "user", 
            "version"
        ],
        "flag" : 1
    }