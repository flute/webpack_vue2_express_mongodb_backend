<template>
    <div class="login" v-show="isShowLogin">
        <div class="login-box">
            <p class="login-title">好氛围运营平台</p>
            <div class="login-form">
                <p class="account"><input placeholder="请输入账号"  v-model="account"></p>
                <p class="pwd"><input placeholder="请输入密码" type="password" v-model="pwd"></p>
                <p class="submit"><button @click="login()">登陆</button></p>
            </div>
        </div>

        <!-- <div class="login-box">
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
        </div> -->
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
                this.$Message.warning({content: '请填写账号密码', duration: 3, closable: true});
                return;
            }
            let apiUrl = this.$store.state.apiUrl
            this.axios.post(apiUrl+'/login',{account: this.account,pwd: this.pwd})
                .then( response => response.data )
                .then( res => {
                    if( res.status ){
                        this.$store.commit('updateUserInfo', res.data)
                        this.$store.commit('updatePermission', res.permission)
                        this.$store.commit('showLogin', false)
                        if( res.notice ){
                            this.$store.commit('updateNotice', res.notice)
                        }
                    }else{
                        //this.tips = res.error_msg
                        this.$Message.error({content: res.msg, duration: 3, closable: true});
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-image: url(../assets/background.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
}
.login-box{
    position: relative;
    height: 464px;
    width: 520px;
    margin: 0 auto;
    margin-top: 11%;
    background-image: url(../assets/formbg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
}
.login-title{
    position: absolute;
    width: 100%;
    text-align: center;
    top: 160px;
    font-size: 24px;
    color: #2d8cf0;
}
.login-form{
    position: absolute;
    display: inline-block;
    width: 100%;
    left: 0;
    top: 222px;
}
.login-form p{
    text-align: center;
}
.login-form p input{
    width: 358px;
    height: 48px;
    background: transparent;
    border: 0;
    padding-left: 60px;
    font-size: 16px;
    color: rgba(0,0,0,.65);
    outline: none;
    border: 1px solid transparent
}
.login-form p input:focus{
    border: 1px solid #2d8cf0
}
.login-form p.pwd{
    margin-top: 21px;
}
.login-form p.submit{
    margin-top: 30px;
}
.login-form p.submit button{
    width: 358px;
    height: 46px;
    border: 0;
    font-size: 24px;
    color: #ffffff;
    background-color: #2d8cf0;
    cursor: pointer;
    outline: none;
}
.login-form p.submit button:hover{
    background-color: #3091f2;
    opacity: 0.8
}
input:-webkit-autofill, 
textarea:-webkit-autofill, 
select:-webkit-autofill { 
       -webkit-box-shadow: 0 0 0 1000px transparent inset; 
}
 input[type=text]:focus, input[type=password]:focus, textarea:focus {
      -webkit-box-shadow: 0 0 0 1000px transparent inset; 
}
</style>

