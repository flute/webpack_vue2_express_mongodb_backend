<template>
    <div class="login" v-show="isShowLogin">
        <div class="login-box">
            <h3>欢迎登陆运营管理平台</h3>
            <div class="login-form">
                <Input v-model="account" placeholder="请输入账号">
                    <span slot="prepend"> 账号 </span>
                </Input>
                <Input type="password" v-model="pwd" placeholder="请输入密码">
                    <span slot="prepend"> 密码 </span>
                </Input>
                <Button type="info" class="login-btn" @click="login()">登陆</Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'login',
    data(){
        return{
            account:'',
            pwd:''
        }
    },
    computed:{
        isShowLogin(){
            return this.$store.state.isShowLogin
        }
    },
    methods:{
        login(){
            if( !this.account || !this.pwd ){
                alert('请填写账号密码');
                return;
            }

            this.axios.post('/login',{account: this.account,pwd: this.pwd})
                .then( response => response.data )
                .then( res => {
                    if( res.status ){
                        this.$store.commit('updateUserInfo', res.data)
                        this.$store.commit('showLogin', false)
                    }else{
                        this.tips = res.error_msg
                    }
                })
        },
        closeAbout(){
            this.$store.commit('showLogin',false);
        }
    }
}
</script>

<style scope>
.login{
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 10;
    background: #f8f8f9;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-box{
    width: 600px;
    height: 300px;
    margin: 0 auto;
    background-color: #ffffff;
    border: 1px solid #dddee1;
    border-radius: 5px;
    padding: 30px 0;
}
.login-form{
    width: 300px;
    margin: 0 auto;
}
.login-box h3{
    height: 60px;
    line-height: 60px;
    font-size: 16px;
}
.ivu-input-wrapper{
    margin-bottom: 10px;
}
.ivu-input-group-prepend{
    width: 50px;
}
.login-btn{
    margin-top: 50px;
    width: 100px;
}
</style>

