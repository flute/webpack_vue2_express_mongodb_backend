<template>
	<div id="app">
		<VLogin></VLogin>
		<Menu class="header-menu" mode="horizontal" active-name="1">
            <div class="layout-logo">运营管理平台</div>
            <div class="layout-ceiling-main">
                <Dropdown class="Dropdown" placement="bottom-end" trigger="click" @on-click="logout">
			        <a href="javascript:void(0)">{{username}} <Icon type="arrow-down-b"></Icon></a>
			        <Dropdown-menu slot="list">
			            <Dropdown-item name="logout">退出</Dropdown-item>
			        </Dropdown-menu>
			    </Dropdown>
            </div>
        </Menu>
        <div class="layout-content">
            <Row type="flex">
	            <i-col class="layout-menu-left" span="4">
	                <VAside></VAside>
	            </i-col>
	            <i-col class="layout-menu-right" span="20">
	            	<div class="layout-breadcrumb">
			            <Breadcrumb>
			                <Breadcrumb-item href="#">首页</Breadcrumb-item>
			                <Breadcrumb-item href="#">应用中心</Breadcrumb-item>
			                <Breadcrumb-item>某应用</Breadcrumb-item>
			            </Breadcrumb>
			        </div>
	                <div class="layout-contents">
	                	<router-view v-if="isLogin"></router-view>
	                </div>
	            </i-col>
	        </Row>
        </div>

	</div>
</template>

<script>
import VAside from './components/Aside.vue'
import VLogin from './components/Login.vue'

export default {
	name: 'app',
	data(){
		return{
			userinfo: this.$store.state.userInfo
		}
	},
	methods:{
		logout(name){
			if( name === 'logout' ){
				this.axios.get('/logout')
				.then(response => response.data)
				.then(res => {
					if( res.status ){
						this.$store.commit('showLogin', true)
						this.$store.commit('updateUserInfo', null)
					}else{
						alert('注销失败')
					}
				})
			}
		},
		checkLogin(){
			this.axios.get('/islogin')
				.then(response => response.data)
				.then(res => {
					if( res.status ){
						// 已登录
						this.$store.commit('showLogin', false)
						this.$store.commit('updateUserInfo', res.userinfo)
						this.$store.commit('updatePermission', res.permission)
					}else{
						// 未登录
					}
				})
		}
	},
	computed:{
		username(){
			return this.$store.state.userInfo ? this.$store.state.userInfo.name : '未登陆'
		},
		isLogin(){
			return this.$store.state.userInfo ? true : false
		}
	},
	components:{
		VAside,
		VLogin
	},
	mounted(){
		console.log('app.vue mounted')
		this.checkLogin();
	}
}
</script>

<style>
#app {
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
	overflow: hidden;
}
.layout-menu-right{
	display: flex;
	flex-direction: column;
}
.layout-contents{
	flex: 1;
	overflow-y: auto;
	padding: 10px;
}
.layout-logo{
    width: 200px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 20px;
    float: left;
    position: relative;
    top: 10px;
    left: 20px;
    text-align: left;
}
.layout-breadcrumb{
    text-align: left;
    background: #f8f8f9;
    padding: 10px 15px;
}
.layout-content{
	height: calc(100% - 60px);
    overflow: hidden;
    background: #fff;
    text-align: left;
}
.layout-content-main{
    padding: 10px;
}
.layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}
.layout-ceiling-main{
	float: right;
	margin-right: 20px;
}
.layout-ceiling-main a{
    color: #9ba7b5;
}
.ivu-row-flex{
	height: 100%;
}
.header-menu{
	background-color: #495060;
}
.layout-menu-left,.layout-menu-left .ivu-menu-light{
	height: 100%;
	text-align: left;
}
.Dropdown{
	background: #333;
	padding: 0 20px;
}
</style>
