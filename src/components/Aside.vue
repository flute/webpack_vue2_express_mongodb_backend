<template>
    <div class="aside">
        <Menu active-name="version"  width="auto" :open-names="['agent']" @on-select="select">
            <Menu-item name="version">
                <span class="icon-cell"><Icon type="android-compass"></Icon></span>
                <span class="layout-text">版本控制</span>
            </Menu-item>
            <Menu-item name="bonus" v-show="true">
                <span class="icon-cell"><Icon type="soup-can-outline"></Icon></span>
                <span class="layout-text">积分项设定</span>
            </Menu-item>
            <Menu-item name="resource">
                <span class="icon-cell"><Icon type="cube"></Icon></span>
                <span class="layout-text">资源配置</span>
            </Menu-item>
            <Menu-item name="agent">
                <span class="icon-cell"><Icon type="person"></Icon></span>
                <span class="layout-text">代理管理</span>
            </Menu-item>
            <!-- <Submenu name="agent">
                <template slot="title">
                    <span class="icon-cell"><Icon type="person"></Icon></span>
                    代理管理
                </template>
                <Menu-item name="1-1">代理列表</Menu-item>
                <Menu-item name="1-2">代理管理</Menu-item>
            </Submenu> -->
            <Menu-item name="settlement">
                <span class="icon-cell"><Icon type="ios-calculator"></Icon></span>
                <span class="layout-text">结算</span>
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
                this.$router.push('/mongo')
            }else if( name === 'agent' ){
                this.$router.push('/agent')
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

