import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/components/Home'
import Mongo from '@/components/Mongo'
import Agent from '@/components/Agent'

Vue.use(Router)

export default new Router({
    routes: [
	    {
	        path: '/',
	        name: 'Hello',
	        component: Hello
	    },
	    {
	        path: '/home',
	        name: 'home',
	        component: Home
	    },
	    {
	        path: '/agent',
	        name: 'agent',
	        component: Agent
	    },
	    {
	    	path: '/mongo',
	    	name: 'mongo',
	    	component: Mongo
	    }
    ]
})