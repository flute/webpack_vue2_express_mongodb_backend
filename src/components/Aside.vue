<template>
    <div class="aside">
        <Menu width="auto" @on-select="select" :active-name="actived">
            <Menu-item name="version" v-show="showVersion">
                <span class="icon-cell"><Icon type="android-compass"></Icon></span>
                <span class="layout-text">版本控制</span>
            </Menu-item>
            <Menu-item name="role" v-show="showRole">
                <span class="icon-cell"><Icon type="soup-can-outline"></Icon></span>
                <span class="layout-text">角色管理</span>
            </Menu-item>
            <Menu-item name="client" v-show="showClient">
                <span class="icon-cell"><Icon type="cube"></Icon></span>
                <span class="layout-text">客户管理</span>
            </Menu-item>
            <Menu-item name="user" v-show="showUser">
                <span class="icon-cell"><Icon type="person"></Icon></span>
                <span class="layout-text">用户管理</span>
            </Menu-item>
        </Menu>
    </div>
</template>

<script>
export default {
	name: 'aside',
    data(){
        return{
            actived: ''
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
        showRole(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('role')>=0 : 'false'
        },
        showClient(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('client')>=0 : 'false'
        },
        showUser(){
            let permissions = this.$store.state.permissions
            return permissions ? permissions.dom.indexOf('user')>=0 : 'false'
        }
    },
    mounted(){
        this.actived = this.$route.name
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

