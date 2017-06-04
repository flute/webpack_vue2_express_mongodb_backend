// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'	    // vuex
import axios from 'axios'	// axios
import VueAxios from 'vue-axios'
import moment from 'moment'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'	// icon
import iView from 'iview'
import 'iview/dist/styles/iview.css'    // 使用 CSS

Vue.config.debug = true; // debug

Vue.component('icon', Icon)
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.changeTime = time => moment(time).startOf('minute').fromNow().replace(/hours?/, '小时').replace('ago', '前').replace(/days?/, '天').replace(/minutes?/, '分钟').replace(/\ban?/, '1').replace(/months?/, '个月').replace(/\byears?/, '年').replace(/\s/g, '').replace('fewseconds','分钟');
// 加载进度条
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});
router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
});

const store = new Vuex.Store({
	state:{
		apiUrl: 'http://127.0.0.1:3000',
		isShowLogin: true,
		userInfo: null,
		permissions: null
	},
	mutations:{
		showLogin(state, flag){
			state.isShowLogin = flag
		},
		updateUserInfo(state, data){
			state.userInfo = data
		},
		updatePermission(state, data){
			state.permissions = data
		}
	}
}) 

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
