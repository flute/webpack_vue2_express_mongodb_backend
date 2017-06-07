<template>
    <div class="role" v-show="showRole">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="blockquote title">我的角色</div>
            	<table>
        			<thead><tr><td>账号</td><td>名称</td><td>权限</td></tr></thead>
        			<tbody>
        				<tr>
        					<td>{{myInfo.account}}</td>
        					<td>{{myInfo.name}}</td>
        					<td>
								<template v-for="per in myPermission.name">
								    <Tag>{{per}}</Tag>
								</template>
        					</td>
        				</tr>
        			</tbody>
        		</table>
            	
            	<div class="role-option">
            		<div class="blockquote">
            			<span class="title">角色管理</span>
            			<Button id="newRole" type="ghost" @click="newRole = true">新增角色</Button>
            		</div>
            		
            	</div>
            	<div class="role-list">
            		<Row>
	            		<template v-for="(role,index) in roles">
	            			<Col span="4" :offset="index?1:0">
							    <div class="card">
					                <p class="card-header">{{role.cname}}</p>
					                <div class="card-body">
					                	<template v-for="item in role.perObj.name">
						                	<Tag>{{item}}</Tag>
						                </template>
					                </div>
					                <div class="card-footer">
					                	<Button type="info" @click.stop="doedit(role.ename)">编辑</Button>
					                	<Button type="error" @click.stop="remove(role.ename)">删除</Button>
					                </div>
					            </div>
					        </Col>
						</template>
            		</Row>
            		<pre>{{roles}}</pre>
            	</div>
            </div>
        </div>
        <Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newRole"
	        :mask-closable="false">
	        <p>
	        	<span class="input-label">角色名称：</span>
	        	<Input v-model="name" placeholder="请输入角色名称" style="width: 250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">拥有权限：</span>
		        <Select v-model="selectper" multiple filterable style="width:250px">
			    	<Option v-for="item in permissions" :value="item.ename" :key="item">{{ item.cname }}</Option>
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
	name: 'role',
	data(){
		return{
			newRole: false,
			modalTitle: '新增角色',
			name:'',
			selectper:[],
			roles:[], // 角色列表
			myInfo: this.$store.state.userInfo,
			myPermission: this.$store.state.permissions,
			permissions:[], // 所有权限
			edit:null
		}
	},
	methods:{
		getRoles(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/role/list')
			.then( response => response.data )
			.then( res => {
				if( res.status ){
					console.log('roles', res)
					this.roles = res.data
					this.permissions = res.permissions
				}
			})
		},
		submit(){
			if( !this.name || this.selectper.length==0 ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}
			let apiUrl = this.$store.state.apiUrl
			if( this.modalTitle === '新增角色' && !this.edit ){
				//新增
				this.axios.post(apiUrl+'/role/new', {name: this.name, permission: this.selectper})
					.then( response => response.data )
					.then( res => {
						if( res.status ){
							this.newRole = false
							this.clear()
							this.$Message.success({content: '创建成功', duration: 3, closable: true});
			                this.getRoles();
						}else{
							this.$Message.error({content: '创建失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else{
				// 编辑
				if( !this.checkEdit() ){
					this.$Message.warning({content: '未做任何修改！', duration: 3, closable: true});
				}else{
					this.axios.post(apiUrl+'/role/update', {oldname: this.edit.ename, newname: this.name, permission: this.selectper})
						.then( response => response.data )
						.then( res => {
							if( res.status ){
								this.newRole = false
								this.clear()
								this.$Message.success({content: '修改成功', duration: 3, closable: true});
				                this.getRoles();
							}else{
								this.$Message.error({content: '修改失败，请重新尝试！', duration: 3, closable: true});
							}
						})
				}
			}
			
			
		},
		remove(roleName){
			console.log('remove:', roleName)
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/role/remove', {name: roleName})
			.then( response => response.data )
			.then( res => {
				if( res.status ){
					this.$Message.success({content: '删除成功', duration: 3, closable: true});
	                this.getRoles();
				}else{
					this.$Message.error({content: '删除失败，请稍后尝试', duration: 3, closable: true});
				}
			})
		},
		doedit(roleName){
			console.log('edit:', roleName)
			this.modalTitle = "编辑角色"
			this.newRole = true
			// 遍历roles，找出当前编辑的角色
			for( let i=0;i<this.roles.length;i++ ){
				if( this.roles[i].ename === roleName ){
					
					this.name = this.roles[i].cname
					this.edit = this.roles[i]
					// 遍历permissions，找出当前编辑的角色拥有的权限
					for( let j=0;j<this.permissions.length;j++ ){
						if( this.roles[i].permissions.indexOf( this.permissions[j].ename ) >=0  ){
							this.selectper.push( this.permissions[j].ename )
						}
					}
					
				}
			}
		},
		cancel(){
			this.newRole = false
			this.clear()
		},
		clear(){
			this.name = ''
			this.selectper = ''
			this.modalTitle = "新增角色"
			this.selectper = []
			this.edit = null
		},
		checkEdit(){
			// 检测编辑是否有变动
			let nameChange = this.name == this.edit.cname ? false : true;
			let permissionChange = this.selectper.toString() == this.edit.permissions.toString() ? false : true 
			return nameChange || permissionChange
		}
	},
	computed:{
		showRole(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('role')>=0 : flase
		}
	},
	mounted(){
		console.log('role mounted')
		this.getRoles();
	}
}
</script>

<style scope>
.card{
	background: #fff;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    transition: all .2s ease-in-out;
	border: 1px solid #dddee1;
    border-color: #e9eaec;
}
.card:hover {
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    border-color: #eee;
}
.card .card-header{
	border-bottom: 1px solid #e9eaec;
    padding: 14px 16px;
    line-height: 1;
}
.card .card-body{
	padding: 16px;
}
.card .card-footer{
	border-top: 1px solid #e9eaec;
	padding: 8px 16px;
	display: flex;
    justify-content: space-between;
}
#newRole{
	margin-left: 30px;
}
.input-label{
	font-size: 14px;
}
</style>


