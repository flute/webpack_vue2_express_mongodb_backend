import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
import Version from '@/components/Version'
import Role from '@/components/Role'
import Client from '@/components/Client'
import User from '@/components/User'
/*import Bonus from '@/components/Bonus'
import Resource from '@/components/Resource'
import Agent from '@/components/Agent'
import Settlement from '@/components/Settlement'
import Mongo from '@/components/Mongo'*/

Vue.use(Router)

export default new Router({
	mode: 'history',
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
	    }
    ]
})