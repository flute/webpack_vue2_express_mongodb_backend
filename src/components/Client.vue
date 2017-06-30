<template>
    <div class="client" v-show="showClient">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="client-option options">
            		<Button type="info" @click="newClient = true">新增客户</Button>
            		<div class="search">
            			<span class="span">按照</span>
	            		<Select v-model="searchmode" style="width:120px" @on-change="changeSelect">
					        <Option v-for="item in searchtype" :value="item.value" :key="item">{{ item.label }}</Option>
					    </Select>
					    <Select v-model="searchstatus" style="width:120px;margin:0 5px" v-show="searchmode==='status'">
					        <Option v-for="item in status" :value="item.value" :key="item">{{ item.label }}</Option>
					    </Select>
					    <Input v-show="searchmode!=='starttime'&&searchmode!=='endtime'&&searchmode!=='status'" v-model="search" placeholder="请输入搜索词" style="width: 150px"></Input>
					    <Date-picker v-show="searchmode==='starttime'||searchmode==='endtime'" :editable="false"
					    v-model="daterange" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px;margin-right:10px"></Date-picker>
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
            					<td>管理员账号</td>
            					<td>到期时间</td>
            					<td class="optiontr">操作</td>
            				</tr>
            			</thead>
            			<tbody>
            				<tr v-for="(client,index) in clients"
            				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
            					<td>{{client.name}}</td>
            					<td>{{client.phone}}</td>
            					<td>{{client.address}}</td>
            					<td>{{client.username}}</td>
            					<td>{{client.adminAccount?client.adminAccount:''}}</td>
            					<td>{{client.endTime?changeTime(client.endTime):''}}</td>
            					<td>
            						<Button type="info" @click.stop="doedit(client._id)">编辑</Button>
            						<Button type="error" @click.stop="remove(client._id)">删除</Button>
            						<Button type="primary" icon="arrow-right-c" @click.stop="showService(client._id,client.name)">服务信息</Button>
            					</td>
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
            	<!-- <pre>{{clients}}</pre> -->
            </div>
        </div>
        <Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newClient"
	        :mask-closable="false">
	        <p>
	        	<span class="input-label">客户名称</span>
	        	<Input v-model="name" :maxlength="20" placeholder="请输入用户名" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">联系电话</span>
	        	<Input v-model="phone" :maxlength="11" placeholder="请输入账号" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">联系地址</span>
	        	<Input v-model="address" :maxlength="30" placeholder="请输入联系地址" style="width: 250px"></Input>
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
			clientArr: [],
			services: null,
			edit: null,
			searchmode: 'name',
			searchtype: [{
				label: '客户名称',
				value: 'name'
			},{
				label: '所属用户',
				value: 'user'
			},{
				label: '开设时间段',
				value: 'starttime'
			},{
				label: '到期时间段',
				value: 'endtime'
			},{
				label: '管理平台账号',
				value: 'admin'
			},{
				label: '服务状态',
				value: 'status'
			}],
			searchstatus: null,
			status: [{
				label: '未开通',
				value: 0
			},{
				label: '已开通',
				value: 1
			},{
				label: '已续接',
				value: 2
			},{
				label: '已变更',
				value: 3
			},{
				label: '已关闭',
				value: 4
			}],
			search: '',
			daterange: null,
			pageSize: 10,
			pageCurrent: 1
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
		getServices(){
			let clientid = this.clientArr.map(function(item){
				return item._id
			})
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/client/service/list', {clientid: clientid, type: 'all'})
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.services = res.data
				}
				//this.loading = false
			})
		},
		submit(){
			if( !this.name || !this.phone || !this.address || !this.selectUser ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}
			if( /[^\d{6,11}]/.test(this.phone) || this.phone.length < 6 || this.phone.length > 11 ){
				this.$Message.warning({content: '请输入正确的联系电话', duration: 3, closable: true});
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

				                if( this.pageCurrent!=1 ){
				                	if( this.clients.length-1 <= (this.pageCurrent-1) * this.pageSize ){
				                		this.pageCurrent -= 1
				                	} 
				                }
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
		showService(id, name){
			this.$router.push({
				path: '/client/service', 
				query: {id: id, page: this.pageCurrent}
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
			if( ((this.searchmode != 'starttime'&&this.searchmode != 'endtime'&&this.searchmode!='status') && this.search === '') 
				||
				((this.searchmode=='starttime'||this.searchmode=='endtime') && (!this.daterange[0] || !this.daterange[1] ))
				||
				(this.searchmode=='status'&&!this.searchstatus)
			){
				this.$Message.warning({content: '请输入搜索内容', duration: 3, closable: true});
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
			}else if( this.searchmode === 'starttime' ){
				let timeStart = new Date( this.daterange[0] ).valueOf()
				let timeEnd = new Date( this.daterange[1] ).valueOf()
				//console.log(timeStart, timeEnd)
				for( let i=0;i<this.services.length;i++ ){
					let stime = new Date(this.services[i].startTime).valueOf()
					//console.log('stime', stime)
					if( stime > timeStart && stime < timeEnd  ){
						for( let j=0;j<this.clientArr.length;j++ ){
							if( this.clientArr[j]._id == this.services[i].clientId ){
								clients.push(this.clientArr[j])
							}
						}
					}
				}
			}else if( this.searchmode === 'endtime' ){
				let timeStart = new Date( this.daterange[0] ).valueOf()
				let timeEnd = new Date( this.daterange[1] ).valueOf()
				for( let i=0;i<this.services.length;i++ ){
					let stime = new Date(this.services[i].endTime).valueOf()
					if( stime > timeStart && stime < timeEnd  ){
						for( let j=0;j<this.clientArr.length;j++ ){
							if( this.clientArr[j]._id == this.services[i].clientId ){
								clients.push(this.clientArr[j])
							}
						}
					}
				}
			}else if( this.searchmode === 'admin' ){
				for( let i=0;i<this.clientArr.length;i++ ){
					if( this.clientArr[i].adminAccount && this.clientArr[i].adminAccount.indexOf(this.search)>=0 ){
						clients.push(this.clientArr[i])
					}
				}
			}else if( this.searchmode === 'status' ){
				for( let i=0;i<this.clientArr.length;i++ ){	
					for( let j=0;j<this.services.length;j++ ){
						if( this.services[j].clientId == this.clientArr[i]._id && this.services[j].status == this.searchstatus ){
							clients.push(this.clientArr[i])
							return;
						}
					}
				}
			}
			this.clients = clients
			this.pageCurrent = 1
		},
		changeSelect(e){
			if( (e === 'starttime' || e === 'endtime' || e === 'status') && !this.services ){
				this.getServices();
			}
		},
		changepage(num){
			this.pageCurrent = num
		},
		clearSearch(){
			this.clients = this.clientArr
			this.search = ''
			this.daterange = null
			this.pageCurrent = 1
		}
	},
	computed:{
		showClient(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('client')>=0 : flase
		},
	},
	created(){
		this.pageCurrent = this.$route.query.page ? Number(this.$route.query.page) : 1

	},
	mounted(){
		this.getusers()
		this.getclients()
	}
}
</script>

<style scoped></style>
