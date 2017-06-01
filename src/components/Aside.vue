<template>
    <div class="aside">
        <Menu active-name="1"  width="auto" :open-names="['2']" @on-select="select">
            <Menu-item name="1">
                <span class="icon-cell"><Icon type="android-compass"></Icon></span>
                <span class="layout-text">版本控制</span>
            </Menu-item>
            <Submenu name="2">
                <template slot="title">
                    <span class="icon-cell"><Icon type="person"></Icon></span>
                    用户管理
                </template>
                <Menu-item name="1-1">用户列表</Menu-item>
                <Menu-item name="1-2">用户管理</Menu-item>
            </Submenu>
            <Submenu name="3">
                <template slot="title">
                    <span class="icon-cell"><Icon type="ios-pulse-strong"></Icon></span>
                    数据统计
                </template>
                <Menu-item name="2-1">流量统计</Menu-item>
                <Menu-item name="2-2">销售数据</Menu-item>
                <Menu-item name="2-2">实时监控</Menu-item>
            </Submenu>
            <Menu-item name="4">
                <span class="icon-cell"><Icon type="help"></Icon></span>
                <span class="layout-text">帮助</span>
            </Menu-item>
            <Menu-item name="mongo" id="mongo">
                <span class="icon-cell"><Icon type="code"></Icon></span>
                <span class="layout-text">mongodb</span>
            </Menu-item>
        </Menu>
    </div>
</template>

<script>
export default {
	name: 'aside',
    data(){
        return{
            name:'CNode'
        }
    },
    methods:{
        select(name){
            console.log('select name：'+name)
            if( name === 'mongo' ){
                this.$router.push('/')
            }else{
                this.$router.push('/home')
            }  
        }
    }
}
</script>

<style>
.aside{
    height: 100%;
}
li.ivu-menu-item .ivu-icon{
    display: inline-block;
    width: 15px;
}
span.icon-cell{
    display: inline-block;
    width: 15px;
    margin-right: 8px;
}
</style>

