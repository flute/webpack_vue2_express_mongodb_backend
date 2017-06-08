// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'	    // vuex
import axios from 'axios'	// axios
import VueAxios from 'vue-axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'    // 使用 CSS

Vue.config.debug = true; // debug

axios.defaults.withCredentials = true    // 请求携带cookie信息-session跨域
Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.checkLogin = function(res){
	if(res.status == -1) this.$store.commit('showLogin', true)
	return res.status == -1 ? false : true
}

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
