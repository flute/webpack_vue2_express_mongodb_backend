<template>
    <div class="client" v-show="showClient">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="client-option options">
            		<Button type="info" @click="newClient = true">新增客户</Button>
            		<div class="search">
            			<span class="span">按照</span>
	            		<Select v-model="searchmode" style="width:100px">
					        <Option v-for="item in searchtype" :value="item.value" :key="item">{{ item.label }}</Option>
					    </Select>
					    <Input v-model="search" placeholder="请输入搜索词" style="width: 150px"></Input>
					    <Button @click="dosearch()">查询</Button>
					    <Button class="clear-search" type="dashed" icon="ios-close-outline" @click="clearSearch()"
					    v-show="clients.length!=clientArr.length">清除</Button>
            		</div>
            	</div>
            	<div class="client-lists">
            		<table>
            			<thead>
            				<tr>
            					<td>客户名称</td>
            					<td>联系电话</td>
            					<td>联系地址</td>
            					<td>绑定用户</td>
            					<td>操作</td>
            				</tr>
            			</thead>
            			<tbody>
            				<tr v-for="(client,index) in clients"
            				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
            					<td>{{client.name}}</td>
            					<td>{{client.phone}}</td>
            					<td>{{client.address}}</td>
            					<td>{{client.username}}</td>
            					<td><Button type="info" @click.stop="showService(client._id)">服务信息</Button></td>
            				</tr>
            			</tbody>
            		</table>
            		<p class="notip" v-show="clients.length==0">没有找到您搜索的客户~</p>
            	</div>
            	<Spin fix v-show="loading">
	                <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
	            </Spin>
            	<div class="paginator">
        			<Page 
        			:total="clients.length" 
        			:page-size="pageSize" 
        			:current="pageCurrent" 
        			@on-change="changepage"
        			show-elevator></Page>
        		</div>
            	<pre>{{clients}}</pre>
            </div>
        </div>
        <Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newClient"
	        :mask-closable="false">
	        <p>
	        	<span class="input-label">客户名称</span>
	        	<Input v-model="name" placeholder="请输入用户名" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">联系电话</span>
	        	<Input v-model="phone" placeholder="请输入账号" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">联系地址</span>
	        	<Input v-model="address" placeholder="请输入联系地址" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">绑定用户</span>
		        <Select v-model="selectUser" style="width:250px" filterable>
			    	<Option v-for="item in users" :value="item._id" :key="item">{{ item.name }}</Option>
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
	name: 'client',
	data(){
		return{
			loading: true,
			newClient: false,
			modalTitle: "新增客户",
			name: '',
			phone: '',
			address: '',
			selectUser: '',
			users: [],
			clients: [],
			clientArr:[],
			edit: null,
			searchmode:'name',
			searchtype:[{
				label: '客户名称',
				value: 'name'
			},{
				label: '所属用户',
				value: 'user'
			}],
			search:'',
			pageSize:10,
			pageCurrent:1
		}
	},
	methods:{
		getusers(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/user/list')
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.users = res.data
				}
			})
		},
		getclients(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/client/list')
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.clients = res.data
					this.clientArr = res.data
				}
				this.loading = false
			})
		},
		submit(){
			if( !this.name || !this.phone || !this.address || !this.selectUser ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}
			let apiUrl = this.$store.state.apiUrl
			if( this.modalTitle === '新增客户' && !this.edit ){
				this.axios.post(apiUrl+'/client/new', {
					name: this.name, 
					phone: this.phone, 
					address: this.address, 
					user: this.selectUser})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newClient = false
							this.clear()
							this.$Message.success({content: '创建成功', duration: 3, closable: true});
							this.getclients()
						}else{
							this.$Message.error({content: '创建失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else{
				this.axios.post(apiUrl+'/client/update', {
					id: this.edit._id,
					name: this.name, 
					phone: this.phone, 
					address: this.address, 
					user: this.selectUser})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newClient = false
							this.clear()
							this.$Message.success({content: '更新成功', duration: 3, closable: true});
							this.getclients()
						}else{
							this.$Message.error({content: '更新失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}
			
		},
		remove(id){
			if( !id ) return;
			this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确定删除该客户？</p>',
                onOk: () => {
                    let apiUrl = this.$store.state.apiUrl
					this.axios.post(apiUrl+'/client/remove', {id: id})
						.then(response => response.data)
						.then( res => {
							if(!this.checkLogin(res))return;
							if( res.status ){
								this.$Message.success({content: '删除成功', duration: 3, closable: true});
				                this.getclients();
							}else{
								this.$Message.error({content: '删除失败，请稍后尝试', duration: 3, closable: true});
							}
						})
                },
                onCancel: () => {
                    //
                }
            });
		},
		doedit(id){
			if( !id ) return;
			this.modalTitle = "编辑客户"
			this.newClient = true
			// 遍历clients，找出当前编辑的用户
			for( let i=0;i<this.clients.length;i++ ){
				if( this.clients[i]._id === id ){
					
					this.name = this.clients[i].name
					this.phone = this.clients[i].phone
					this.address = this.clients[i].address
					this.edit = this.clients[i]
					// 遍历users，找出当前编辑的用户拥有的角色
					for( let j=0;j<this.users.length;j++ ){
						if( this.clients[i].user == this.users[j]._id  ){
							this.selectUser = this.users[j]._id
						}
					}
					
				}
			}
		},
		showService(id){
			this.$router.push({
				path: '/client/service', 
				query: {id: id}
			})
		},
		cancel(){
			this.newClient = false
			this.clear()
		},
		clear(){
			this.name = ''
			this.phone = ''
			this.address = ''
			this.modalTitle = "新增客户"
			this.selectUser = []
			this.edit = null
		},
		dosearch(){
			if( this.search === '' ){
				this.$Message.warning({content: '请输入搜索词', duration: 3, closable: true});
				return;
			}
			let clients = [];
			
			if( this.searchmode === 'name' ){
				for( let i=0;i<this.clientArr.length;i++ ){
					if( this.clientArr[i].name.indexOf(this.search)>=0 ){
						clients.push(this.clientArr[i])
					}
				}
			}else if( this.searchmode === 'user' ){
				let clientUser = '';
				for( let i=0;i<this.users.length;i++ ){
					if( this.users[i].name.indexOf(this.search)>=0 ){
						clientUser = this.users[i]._id
					}
				}
				if( clientUser ){
					for( let i=0;i<this.clientArr.length;i++ ){
						if( this.clientArr[i].user ==  clientUser){
							clients.push(this.clientArr[i])
						}
					}
				}
			}
			this.clients = clients;
		},
		changepage(num){
			this.pageCurrent = num
		},
		clearSearch(){
			this.clients = this.clientArr
			this.search = ''
		}
	},
	computed:{
		showClient(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('client')>=0 : flase
		},
	},
	mounted(){
		this.getusers()
		this.getclients()
	}
}
</script>

<style scoped>
.ivu-date-picker{
	display: inline-block;
	width: 250px !important;
}
</style>
