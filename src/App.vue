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
	            <i-col class="layout-menu-left" span="3">
	                <VAside></VAside>
	            </i-col>
	            <i-col class="layout-menu-right" span="21">
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
				let apiUrl = this.$store.state.apiUrl
				this.axios.get(apiUrl+'/logout')
				.then(response => response.data)
				.then(res => {
					if( res.status ){
						this.$store.commit('showLogin', true)
						this.$store.commit('updateUserInfo', null)
					}
				})
			}
		},
		checkLogin(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/islogin')
				.then(response => response.data)
				.then(res => {
					if( res.status === 1 ){
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
	beforeCreate(){
		console.log('beforeCreate', this.$store.state.isShowLogin)
	},
	created(){
		console.log('created', this.$store.state.isShowLogin)
		this.checkLogin();
	},
	beforeMount(){
		console.log('beforeMount', this.$store.state.isShowLogin)
	},
	mounted(){
		console.log('mounted', this.$store.state.isShowLogin)
		
	},
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
	background-color: #495060 !important;
}
.layout-menu-left,.layout-menu-left .ivu-menu-light{
	height: 100%;
	text-align: left;
}
.Dropdown{
	background: #333;
	padding: 0 20px;
}
.blockquote{
	border-left: 3px solid #dddee1;
    padding: 10px;
    background: #f8f8f9;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}
.title{
	font-size: 18px;
	font-weight: bold;
	color: rgb(44, 62, 80);
}
table{
	width: 100%;
    text-align: left;
    border-collapse: collapse;
    border:1px solid #dddee1; 
    margin: 10px 0;
} 
table tr{
	border-bottom: 1px solid #e9eaec;
	height: 48px;
	line-height: 48px;
} 
table tr td{
	padding: 0 18px;
}
thead tr{
	height: 40px;
	line-height: 40px;
	background-color: #f8f8f9
}
table tbody tr:hover{
	background-color: #ebf7ff;
}
.search{
	display: inline-flex;
    align-items: center;
    margin-left: 50px;
}
.search span.span{
	margin-right: 10px;
    font-size: 14px;
}
.search .ivu-input-wrapper{
	margin: 0 5px;
}
.paginator{
	margin: 20px 0;
	display: flex;
    justify-content: flex-end;
}
.offset-right{
	margin-left: 0;
    margin-right: 3.16666667%;
}
.clear-search{
	margin-left: 10px;
}
.options{
	margin-bottom: 20px;
	background: #f8f8f9;
    padding: 10px;
	border: 1px solid #dddee1;
}
.input-label{
	display: inline-block;
    width: 100px;
	font-size: 14px;
}
.ivu-select-multiple .ivu-select-item-selected{
	display: flex;
	display: -ms-flexbox;
	justify-content: space-between;
	-ms-justify-content: space-between;
	align-content: center;
	-ms-align-content: center;
	line-height: 24px;
}
.ivu-input-wrapper{
	margin-bottom: 0 !important;
}
.login-form .ivu-input-wrapper{
	margin-bottom: 15px !important;
}
.ivu-modal-body p{
	margin-bottom: 10px;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
</style>
