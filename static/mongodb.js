/* 
 * mongodb初始化数据
 * 数据库： operate
 * 账号/密码： 18888888888/123456
*/

/* t_user */

    {
        "_id" : ObjectId("59361d188862e097ef9797f7"),
        "name" : "超级管理员",
        "account" : "18001194295",
        "pwd" : "e10adc3949ba59abbe56e057f20f883e",
        "roles" : [ 
            "59361cc98862e097ef9797f6"
        ],
        "parents" : [],
        "flag" : 1
    }

/* t_permission */

    /* 1 */
    {
        "_id" : ObjectId("59361c698862e097ef9797f2"),
        "name" : "版本控制",
        "path" : [ 
            "/version/list", 
            "/version/new", 
            "/version/update", 
            "/version/remove", 
            "/version/publish"
        ],
        "dom" : [ 
            "version"
        ],
        "flag" : 1
    }

    /* 2 */
    {
        "_id" : ObjectId("59361c698862e097ef9797f3"),
        "name" : "角色管理",
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
        "_id" : ObjectId("59361c698862e097ef9797f4"),
        "name" : "客户管理",
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
        "_id" : ObjectId("59361c698862e097ef9797f5"),
        "name" : "用户管理",
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
        "_id" : ObjectId("59361cc98862e097ef9797f6"),
        "name" : "超级管理员",
        "permissions" : [ 
            "59361c698862e097ef9797f2", 
            "59361c698862e097ef9797f3", 
            "59361c698862e097ef9797f4", 
            "59361c698862e097ef9797f5"
        ],
        "flag" : 1
    }