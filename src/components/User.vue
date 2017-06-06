<template>
    <div class="user" v-show="showUser">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="user-option">
            		<Button type="info" @click="newUser = true">新增用户</Button>
            	</div>
            	<div class="user-lists">
            		<table>
            			<thead>
            				<tr>
            					<td>用户名</td>
            					<td>账号</td>
            					<td>角色</td>
            					<td>操作</td>
            				</tr>
            			</thead>
            			<tbody>
            				
            			</tbody>
            		</table>
            	</div>
            </div>
        </div>
        <Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newUser"
	        :mask-closable="false">
	        <p>
	        	<span class="input-label">用户名</span>
	        	<Input v-model="name" placeholder="请输入角色名称" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">账号</span>
	        	<Input v-model="account" placeholder="请输入角色名称" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">密码</span>
	        	<Input v-model="pwd" placeholder="请输入角色名称" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">角色</span>
		        <Select v-model="selectRole" multiple style="width:250px">
			    	<Option v-for="item in roles" :value="item.ename" :key="item">{{ item.cname }}</Option>
			    </Select>
	        </p>
	        <div slot="footer">
	            <Button @click="cancel()">取消</Button>
	            <Button type="success" @click="submit()">确认</Button>
	        </div>   
	    </Modal>
    </div>
</template>

<script>
export default {
	name: 'user',
	data(){
		return{
			newUser: false,
			modalTitle: "新增用户",
			name: '',
			account: '',
			pwd: '',
			selectRole: [],
			roles:[]
		}
	},
	methods:{
		getRoles(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/role/list')
			.then( response => response.data )
			.then( res => {
				if( res.status ){
					this.roles = res.data
				}
			})
		},
		getUsers(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/user/list')
			.then( response => response.data )
			.then( res => {
				if( res.status ){
					this.users = res.data
				}
			})
		},
		submit(){
			if( !this.name || !this.account || !this.pwd || !this.selectRole ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}
			this.axios.post('/user/new', {name: this.name, account: account, pwd: this.pwd, roles: this.selectRole})
				.then( response => response.data )
				.then( res => {
					if( res.status ){
						this.newUser = false
						this.clear()
						this.$Message.success({content: '创建成功', duration: 3, closable: true});
					}else{
						this.$Message.error({content: '创建失败，请重新尝试！', duration: 3, closable: true});
					}
				})
		},
		cancel(){},
		clear(){
			this.name = ''
			this.account = ''
			this.pwd = ''
			this.modalTitle = "新增用户"
			this.selectRole = []
		}
	},
	computed:{
		showUser(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('user')>=0 : flase
		},
	},
	mounted(){
		this.getUsers()
		this.getRoles()
	}
}
</script>

<style scope>
.input-label{
    display: inline-block;
    width: 60px;
}
</style>


