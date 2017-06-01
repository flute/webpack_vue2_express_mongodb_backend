<template>
	<div id="app">
		<Menu class="header-menu" mode="horizontal" active-name="1">
            <div class="layout-logo">运营管理平台</div>
            <div class="layout-ceiling-main">
                <Dropdown class="Dropdown" placement="bottom-end" trigger="click">
			        <a href="javascript:void(0)">ludis <Icon type="arrow-down-b"></Icon></a>
			        <Dropdown-menu slot="list">
			            <Dropdown-item>退出</Dropdown-item>
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
	                	<router-view></router-view>
	                </div>
	            </i-col>
	        </Row>
        </div>
	</div>
</template>

<script>
import VAside from './components/Aside.vue'

export default {
	name: 'app',
	components:{
		VAside
	}
}
</script>

<style>
.layout-menu-right{
	display: flex;
	flex-direction: column;
}
.layout-contents{
	flex: 1;
	overflow-y: auto;
	padding: 10px;
}
#app {
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
	overflow: hidden;
}
.Cyan{
 	background-color: rgb(0, 188, 212);
}
.Teal{
 	background-color: rgb(0, 150, 136);
}
.Green{
 	background-color: rgb(76, 175, 80);
}
.Light-Green{
	background-color: rgb(139, 195, 74);
}
.Lime{
  	background-color: rgb(205, 220, 57);
}
.Yellow{
  	background-color: rgb(255, 235, 59);
}
.Amber{
  	background-color: rgb(255, 193, 7);
}
.Orange{
  	background-color: rgb(255, 152, 0);
}
.Brown{
  	background-color: rgb(121, 85, 72);
}
.Blue-Grey{
  	background-color: rgb(96, 125, 139);
}
.Grey{
  	background-color: rgb(158, 158, 158);
}
.Deep-Orange{
  	background-color: rgb(255, 87, 34);
}
.Red{
  	background-color: rgb(244, 67, 54);
}
.Purple{
  	background-color: rgb(156, 39, 176);
}
.Deep-Purple{
  	background-color: rgb(103, 58, 183);
}
.Blue{
  	background-color: rgb(33, 150, 243);
}
.Light-Blue{
  	background-color: rgb(3, 169, 244);
}
.Indigo{
  	background-color: rgb(63, 81, 181);
}
.Pink{
  	background-color: rgb(233, 30, 99);
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
