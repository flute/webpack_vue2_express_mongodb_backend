import Vue from 'vue'
import Router from 'vue-router'

import Hello from '@/components/Hello'
import Version from '@/components/Version'
import Bonus from '@/components/Bonus'
import Resource from '@/components/Resource'
import Agent from '@/components/Agent'
import Settlement from '@/components/Settlement'
import Mongo from '@/components/Mongo'

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
	        path: '/bonus',
	        name: 'bonus',
	        component: Bonus
	    },
	    {
	        path: '/resource',
	        name: 'resource',
	        component: Resource
	    },
	    {
	        path: '/agent',
	        name: 'agent',
	        component: Agent
	    },
	    {
	        path: '/settlement',
	        name: 'settlement',
	        component: Settlement
	    },
	    {
	    	path: '/mongo',
	    	name: 'mongo',
	    	component: Mongo
	    }
    ]
})