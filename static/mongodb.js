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
            "/client/update", 
            "/client/service/list", 
            "/client/service/new", 
            "/client/service/update", 
            "/client/service/remove", 
            "/client/service/open", 
            "/client/service/close", 
            "/client/service/renewal", 
            "/client/service/change"
        ],
        "dom" : [ 
            "client", 
            "add-client"
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

    /* 5 */
    {
        "_id" : ObjectId("595ca0101a3041e05f7519ff"),
        "name" : "客户管理(代理)",
        "path" : [ 
            "/user/list", 
            "/client/list", 
            "/client/new", 
            "/client/remove", 
            "/client/update", 
            "/client/service/list", 
            "/client/service/update", 
            "/client/service/remove", 
            "/client/service/open", 
            "/client/service/close", 
            "/client/service/renewal", 
            "/client/service/change"
        ],
        "dom" : [ 
            "client"
        ],
        "flag" : 1
    }

    /* 6 */
    {
        "_id" : ObjectId("5962e940a959001506e9d33c"),
        "name" : "账单",
        "path" : [ 
            "/bill/list", 
            "/bill/export"
        ],
        "dom" : [ 
            "bill"
        ],
        "flag" : 1
    }

    /* 5 */
    {
        "_id" : ObjectId("595ca0101a3041e05f7519ff"),
        "name" : "客户管理(代理)",
        "path" : [ 
            "/user/list", 
            "/client/list", 
            "/client/new", 
            "/client/remove", 
            "/client/update", 
            "/client/service/list", 
            "/client/service/update", 
            "/client/service/remove", 
            "/client/service/open", 
            "/client/service/close", 
            "/client/service/renewal", 
            "/client/service/change"
        ],
        "dom" : [ 
            "client"
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
            "59361c698862e097ef9797f5", 
            "5962e940a959001506e9d33c"
        ],
        "flag" : 1
    }

    /* 2 */
    {
        "_id" : ObjectId("593e4182551ddd6af6d5f13c"),
        "name" : "管理员",
        "permissions" : [ 
            "59361c698862e097ef9797f4", 
            "59361c698862e097ef9797f5"
        ],
        "flag" : 1
    }

    /* 3 */
    {
        "_id" : ObjectId("593e41ac551ddd6af6d5f13d"),
        "name" : "代理",
        "permissions" : [ 
            "595ca0101a3041e05f7519ff"
        ],
        "flag" : 1
    }