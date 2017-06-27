<template>
    <div class="version" v-show="showVersion">
        <div class="contents">
            <div class="layout-content-main">
            	<div class="version-option options">
            		<Button id="newVersion" type="info" @click="newVersion = true">新增版本</Button>
            		<div class="search">
            			<span class="span">按照</span>
	            		<Select v-model="searchmode" style="width:100px">
					        <Option v-for="item in searchtype" :value="item.value" :key="item">{{ item.label }}</Option>
					    </Select>
					    <Input v-model="search" placeholder="请输入搜索词" style="width: 150px"></Input>
					    <Button @click="dosearch()">查询</Button>
					    <Button class="clear-search" type="dashed" icon="ios-close-outline" @click="clearSearch()"
					    v-show="versions.length!=versionArr.length">清除</Button>
            		</div>
            	</div>
            	<div class="role-list">
            		<table>
            			<thead>
            				<tr>
            					<td>版本名称</td>
            					<td>产品名称</td>
            					<td>平台</td>
            					<td>更新模式</td>
            					<td>更新地址</td>
            					<td>版本号</td>
            					<td class="optiontr">操作</td>	
            				</tr>
            			</thead>
            			<tbody>
            				<tr v-for="(v,index) in versions"
            				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
            					<td>{{v.description}}</td>
            					<td>{{v.name}}</td>
            					<td>
        							<template v-for="item in platform">
        								<template v-if="item.value == v.platform">{{item.label}}</template>
        							</template>
            					</td>
            					<td>
        							<template v-for="item in mode">
        								<template v-if="item.value == v.updateType">{{item.label}}</template>
        							</template>
            					</td>
            					<td>{{v.updateAddr}}</td>
            					<td>{{v.version}}</td>
            					<td>
            						<Button 
            							:type="v.pubStatus?'warning':'success'" 
            							@click.stop="publish(v._id)">
            							<span v-text="v.pubStatus?'取消发布':'发布'"></span>
            						</Button>
            						<Button type="info" @click.stop="doedit(v._id)">编辑</Button>
            						<Button type="error" @click.stop="remove(v._id)">删除</Button>
            					</td>
            				</tr>
            			</tbody>
            		</table>
            		<p class="notip" v-show="versions.length==0">没有找到您搜索的版本~</p>
            	</div>
	            <Spin fix v-show="loading">
	                <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
	            </Spin>
            	<div class="paginator">
        			<Page 
        			:total="versions.length" 
        			:page-size="pageSize" 
        			:current="pageCurrent" 
        			@on-change="changepage"
        			show-elevator></Page>
        		</div>
        		<!-- <pre>{{versions}}</pre> -->
            </div>
        </div>
        <Modal 
        	@on-ok="submit" 
        	@on-cancel="cancel"
			:title="modalTitle"
			v-model="newVersion"
			:mask-closable="false">
	        <p>
	        	<span class="input-label">版本名称：</span>
	        	<Input v-model="desc" :maxlength="20" placeholder="请输入版本名称" style="width:250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">产品名称：</span>
	        	<Input v-model="name" :maxlength="20" placeholder="请输入产品名称" style="width:250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">平台：</span>
		        <Select v-model="selectPlatform" filterable style="width:250px">
			    	<Option v-for="item in platform" :value="item.value" :key="item">{{ item.label }}</Option>
			    </Select>
	        </p>
	        <p>
	        	<span class="input-label">更新类型：</span>
	        	<Select v-model="selectMode" filterable style="width:250px">
			    	<Option v-for="item in mode" :value="item.value" :key="item">{{ item.label }}</Option>
			    </Select>
	        </p>
			<p>
	        	<span class="input-label">版本号：</span>
	        	<Input v-model="number" :maxlength="10" placeholder="请输入版本号" style="width:250px"></Input>
	        </p>
	        <p>
	        	<span class="input-label">更新地址：</span>
	        	<Input v-model="address" :maxlength="100" placeholder="请输入更新地址" style="width:250px"></Input>
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
	name: 'version',
	data(){
		return{
			loading: true,
			newVersion: false,
			modalTitle: '新增版本',
			desc: '',
			name: '',
			address: '',
			number: '',
			selectPlatform: 'ios',
			platform: [{
				label: 'iOS',
				value: 'ios'
			},{
				label: 'Android',
				value: 'android'
			}],
			selectMode: 'choose',
			mode: [{
				label: '选择更新',
				value: 'choose'
			},{
				label: '强制更新',
				value: 'must'
			}],
			versions:[],
			versionArr:[],
			edit:null,
			searchmode:'desc',
			searchtype:[{
				label: '版本名称',
				value: 'desc'
			},{
				label: '产品名称',
				value: 'name'
			},{
				label: '版本号',
				value: 'number'
			}],
			search: '',
			pageSize: 10,
			pageCurrent: 1
		}
	},
	methods:{
		getVersion(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/version/list')
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					//console.log('Version', res)
					this.versions = res.data
					this.versionArr = res.data
				}else{
					this.$Message.error({content: '请求数据出错，请稍后尝试！', duration: 3, closable: true});
				}
				this.loading = false
			})
		},
		submit(){
			if( !this.desc || !this.name || !this.address || !this.selectPlatform || !this.selectMode || !this.number ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}
			let apiUrl = this.$store.state.apiUrl
			if( this.modalTitle === '新增版本' && !this.edit ){
				//新增
				this.axios.post(apiUrl+'/version/new', {
					desc: this.desc,
					name: this.name,
					address: this.address,
					selectPlatform: this.selectPlatform,
					selectMode: this.selectMode,
					number: this.number})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newVersion = false
							this.clear()
							this.$Message.success({content: '创建成功', duration: 3, closable: true});
			                this.getVersion();
						}else{
							this.$Message.error({content: '创建失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else{
				// 编辑
				if( !this.checkEdit() ){
					this.$Message.warning({content: '未做任何修改！', duration: 3, closable: true});
				}else{
					this.axios.post(apiUrl+'/version/update', {
						id: this.edit._id,
						desc: this.desc,
						name: this.name,
						address: this.address,
						selectPlatform: this.selectPlatform,
						selectMode: this.selectMode,
						number: this.number})
						.then( response => response.data )
						.then( res => {
							if(!this.checkLogin(res))return;
							if( res.status ){
								this.newVersion = false
								this.clear()
								this.$Message.success({content: '修改成功', duration: 3, closable: true});
				                this.getVersion();
							}else{
								this.$Message.error({content: '修改失败，请重新尝试！', duration: 3, closable: true});
							}
						})
				}
			}
			
			
		},
		remove(id){
			this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确定删除该版本？</p>',
                onOk: () => {
                    let apiUrl = this.$store.state.apiUrl
					this.axios.post(apiUrl+'/version/remove', {id: id})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.$Message.success({content: '删除成功', duration: 3, closable: true});
			                this.getVersion();

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
			this.modalTitle = "编辑版本"
			this.newVersion = true
			for( let i=0;i<this.versions.length;i++){
				if(this.versions[i]._id === id){
					this.edit = this.versions[i]
					this.desc = this.versions[i].description
					this.name = this.versions[i].name
					this.address = this.versions[i].updateAddr
					this.number = this.versions[i].version
					this.selectPlatform = this.versions[i].platform
					this.selectMode = this.versions[i].updateType
				}
			}
		},
		publish(id){
			if(!id) return;
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/version/publish', {id: id})
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.$Message.success({content: '操作成功', duration: 3, closable: true});
	                this.getVersion();
				}else{
					this.$Message.error({content: '操作失败，请稍后尝试', duration: 3, closable: true});
				}
			})
		},
		dosearch(){
			if( this.search === '' ){
				this.$Message.warning({content: '请输入搜索词', duration: 3, closable: true});
				return;
			}
			
			let version = [];
			
			for( let i=0;i<this.versionArr.length;i++ ){
				if( this.searchmode === 'desc' ){
					if( this.versionArr[i].description.indexOf(this.search)>=0 ){
						version.push(this.versionArr[i])
					}
				}else if( this.searchmode === 'name' ){
					if( this.versionArr[i].name.indexOf(this.search)>=0 ){
						version.push(this.versionArr[i])
					}
				}else if( this.searchmode === 'number' ){
					if( this.versionArr[i].version.indexOf(this.search)>=0 ){
						version.push(this.versionArr[i])
					}
				}
			}

			this.versions = version
			this.pageCurrent = 1
			
		},
		cancel(){
			this.newVersion = false
			this.clear()
		},
		clear(){
			this.name = ''
			this.desc = ''
			this.address = ''
			this.number = ''
			this.selectPlatform = 'ios'
			this.selectMode = 'choose'
			this.modalTitle = "新增版本"
			this.edit = null
		},
		checkEdit(){
			// 检测编辑是否有变动
			let nameChange = this.name == this.edit.name ? false : true
			let descChange = this.desc == this.edit.description ? false : true
			let addressChange = this.address == this.edit.updateAddr ? false : true
			let numberChange = this.number == this.edit.version ? false : true
			let selectModeChange = this.selectMode == this.edit.updateType ? false : true
			let selectPlatformChange = this.selectPlatform == this.edit.platform ? false : true 
			return nameChange || descChange || addressChange || numberChange || selectModeChange || selectPlatformChange
		},
		changepage(num){
			this.pageCurrent = num
		},
		clearSearch(){
			this.versions = this.versionArr
			this.search = ''
			this.pageCurrent = 1
		}
	},
	computed:{
		showVersion(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('version')>=0 : false
		}
	},
	mounted(){
		this.getVersion();
	}
}
</script>

<style scoped>
table tr{
	border:0;
}
table tr td{
	border: 1px solid #e9eaec
}
</style>


