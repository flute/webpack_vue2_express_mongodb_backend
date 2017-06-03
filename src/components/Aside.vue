<template>
    <div class="aside">
        <Menu width="auto" @on-select="select">
            <Menu-item name="version" v-show="showVersion">
                <span class="icon-cell"><Icon type="android-compass"></Icon></span>
                <span class="layout-text">版本控制</span>
            </Menu-item>
            <Menu-item name="bonus" v-show="showBonus">
                <span class="icon-cell"><Icon type="soup-can-outline"></Icon></span>
                <span class="layout-text">积分项设定</span>
            </Menu-item>
            <Menu-item name="resource" v-show="showResource">
                <span class="icon-cell"><Icon type="cube"></Icon></span>
                <span class="layout-text">资源配置</span>
            </Menu-item>
            <Menu-item name="agent" v-show="showAgent">
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
            <Menu-item name="settlement" v-show="showSettlement">
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
            
        }
    },
    methods:{
        select(name){ // 点击菜单跳转
            console.log('select name：'+name)
            this.$router.push('/'+name)
        }
    },
    computed:{ // 菜单显示控制
        showVersion(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('version')>=0 : 'false'
        },
        showBonus(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('bonus')>=0 : 'false'
        },
        showResource(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('resource')>=0 : 'false'
        },
        showAgent(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('agent')>=0 : 'false'
        },
        showSettlement(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('settlement')>=0 : 'false'
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

