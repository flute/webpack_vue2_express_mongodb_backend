import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
import Version from '@/components/Version'
import Role from '@/components/Role'
import Client from '@/components/Client'
import User from '@/components/User'
import Service from '@/components/Service'
import Notice from '@/components/Notice'
import Bill from '@/components/Bill'
import BillDetail from '@/components/BillDetail'

Vue.use(Router)

export default new Router({
	//mode: 'hashbang',
    routes: [
	    {
	        path: '/',
	        name: 'Hello',
	        component: Hello
	    },
	    {
	        path: '/version',
	        name: 'version',
	        component: Version
	    },
	    {
	        path: '/role',
	        name: 'role',
	        component: Role
	    },
	    {
	        path: '/client',
	        name: 'client',
	        component: Client
	    },
	    {
	        path: '/user',
	        name: 'user',
	        component: User
	    },
	    {
	    	path: '/client/service',
	    	name: 'service',
	    	component: Service
	    },
	    {
	    	path: '/notice',
	    	name: 'notice',
	    	component: Notice
	    },
	    {
	    	path: '/bill',
	    	name: 'bill',
	    	component: Bill
	    },
	    {
	    	path: '/bill/detail',
	    	name: 'billdetail',
	    	component: BillDetail
	    }
    ]
})