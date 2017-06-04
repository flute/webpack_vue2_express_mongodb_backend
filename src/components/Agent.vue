<template>
    <div class="agent" v-show="showAgent">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="agent-option">
            		<Button type="info" @click="newAgent = true">新增代理</Button>
            		<Button type="error" v-show="showAgentBtn">permission</Button>
            	</div>
            	<div class="agent-list">
            		<table>
            			<thead>
            				<tr>
            					<td>账号</td>
            					<td>名称</td>
            					<td>权限</td>
            					<td>操作</td>
            				</tr>
            			</thead>
            			<tbody>
            				<tr v-for="(item,index) in agent">
            					<td>{{item.account}}</td>
            					<td>{{item.name}}</td>
            					<td>{{item.roles}}</td>
            					<td>
            						<Button>删除</Button>
            					</td>
            				</tr>
            			</tbody>
            		</table>
            		<pre>{{agent}}</pre>
            	</div>
            </div>
        </div>
        <Modal @on-ok="submit" @on-cancel="cancel"
	        title="对话框标题"
	        v-model="newAgent"
	        :mask-closable="false">
	        <Input v-model="account"><span slot="prepend">账号</span></Input>
	        <Input v-model="name"><span slot="prepend">名称</span></Input>
	        <Input v-model="pwd"><span slot="prepend">密码</span></Input>
	        <div slot="footer">
	            <Button @click="cancel()">取消</Button>
	            <Button type="success" @click="submit()">确认</Button>
	        </div>   
	    </Modal>
    </div>
</template>

<script>
export default {
	name: 'agent',
	data(){
		return{
			newAgent: false,
			account:'',
			name:'',
			pwd:'',
			agent:[]
		}
	},
	methods:{
		submit(){
			if( !this.account || !this.name || !this.pwd ){
				this.$Message.warning({
                    content: '请填写完整信息',
                    duration: 3,
                    closable: true
                });
				return;
			}
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/agent/new', {admin: this.$store.state.userInfo.account, account: this.account, name: this.name, pwd: this.pwd})
				.then( response => response.data )
				.then( res => {
					if( res.status ){
						this.newAgent = false
						this.clear()
						this.$Message.success({
		                    content: '创建成功',
		                    duration: 3,
		                    closable: true
		                });
					}else{
						this.$Message.error({
		                    content: '创建成功',
		                    duration: 3,
		                    closable: true
		                });
					}
				})
		},
		getAgent(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/agent/list', {account: this.$store.state.userInfo.account})
			.then( response => response.data )
			.then( res => {
				if( res.status ){
					this.agent = res.data
				}
			})
		},
		cancel(){
			this.newAgent = false
			this.clear()
		},
		clear(){
			this.account = ''
			this.name = ''
			this.pwd = ''
		}
	},
	computed:{
		showAgent(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('agent')>=0 : flase
		},
		showAgentBtn(){
			let permissions = this.$store.state.permissions
			return permissions ? permissions.dom.indexOf('version')>=0 : false
		}
	},
	mounted(){
		console.log('agent mounted')
		this.getAgent();
	}
}
</script>

<style scope>
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
</style>


