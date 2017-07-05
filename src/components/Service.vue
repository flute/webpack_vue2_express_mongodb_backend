<template>
	<div class="service" v-show="showService">
		<div class="contents">
			<div class="layout-content-main">
				<div class="service-option options">
					<Button type="primary" icon="arrow-left-c" @click="turnback">返回</Button>
            		<Button class="add" type="info" @click="newService = true" v-show="showNew()">新增服务</Button>
            		<span class="client-name">{{client?client.name:''}}</span>
            	</div>
            	<div class="service-lists">
				    <Timeline>
				    	<template v-for="(service,index) in services"
        				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
				    		<Timeline-item :color="colors[service.status]" >
		        				<p class="time">{{status[service.status]}}</p>
		            			<p class="content">
		            				<tr class="tr">
		            					<td>操作时间：<b>{{changeTime(service.createAt)}}</b></td>
			        					<td>服务开始时间：<b>{{changeTime(service.startTime)}}</b></td>
			        					<td>服务截止时间：<b>{{changeTime(service.endTime)}}</b></td>
			        					<td>服务人数：<b>{{service.userNum}}</b> 人</td>
			        					
			        					<!-- <td v-if="service.closeAt">关闭时间：<b>{{changeTime(service.closeAt)}}</b></td> -->
			        					<td class="service-option">
			        						<template v-if="service.status===0">
			        							<Button type="success" @click.stop="doopen(service._id)">开通</Button>
			        							<Button type="info" @click.stop="doedit(service._id)">编辑</Button>
			        							<Button type="error" @click.stop="del(service._id)">删除</Button>
			        						</template>
			        						<template v-if="service.status===1">
			        							<Button type="success" @click.stop="renewal(service._id)">续接</Button>
			        							<Button type="info" @click.stop="change(service._id)">变更</Button>
			        							<Button type="error" @click.stop="close(service._id)">关闭</Button>
			        						</template>
			        						<!-- <Button type="info" 
			        							v-if="client.adminAccount&&(service.status==0||service.status==1)"
			        							@click.stop="resetPwd()"
			        						>重置密码</Button> -->
			        					</td>
			        				</tr>
			        				
		            			</p>
		        			</Timeline-item>
				    	</template>
        			</Timeline>
	        		<p class="notip" v-show="services.length==0">暂无服务信息~</p>
	        	</div>
	        	<Spin fix v-show="loading">
	                <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
	            </Spin>
	        	<div class="paginator">
	    			<Page 
	    			:total="services.length" 
	    			:page-size="pageSize" 
	    			:current="pageCurrent" 
	    			@on-change="changepage"
	    			show-elevator></Page>
	    		</div>
	        	<!-- <pre>{{services}}</pre> -->
			</div>
		</div>
		<Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newService"
	        :mask-closable="false">
	        <div v-show="option=='admin' ">
	        	<p>
		        	<span class="input-label">管理员账号</span>
		        	<Input v-model="account" :maxlength="11" placeholder="请输入账号"></Input>
		        </p>
		        <p>
		        	<span class="input-label">初始密码</span>
		        	<Input type="password" :maxlength="20" v-model="pwd" placeholder="请输入密码"></Input>
		        </p>
	        </div>
	        <div v-show="option!='admin'&&option!='reset'">
	        	<p>
		        	<span class="input-label">开通时间</span>
		        	<Date-picker :editable="false" v-model="starttime" type="date" :disabled="option==='renewal'" placeholder="选择开始日期" style="width: 200px"></Date-picker>
		        </p>
		        <p>
		        	<span class="input-label">截止时间</span>
		        	<Date-picker :editable="false" v-model="endtime" type="date" :options="timemin" placeholder="选择截止日期" style="width: 200px"></Date-picker>
		        </p>
		        <p>
		        	<span class="input-label">服务人数</span>
		        	<Input v-model="usernum" placeholder="请输入服务人数" style="width:250px"></Input>
		        </p>
	        </div>
	        <div v-show="option=='reset'">
	        	<p>
		        	<span class="input-label">新密码</span>
		        	<Input type="password" :maxlength="20" v-model="pwd" placeholder="请输入密码"></Input>
		        </p>
	        </div> 
	        <div slot="footer">
	            <Button @click="cancel()">取消</Button>
	            <Button type="success" @click="submit()" :loading="issubmit" v-show="option=='admin' ">
					<span v-if="!issubmit">确认</span>
			        <span v-else>提交中...</span>
	            </Button>
				<Button type="success" @click="submit()"  v-show="option!='admin'">确认</Button>   
	        </div>  
	    </Modal>
	</div>
</template>

<script>
export default{
	name: 'service',
	data(){
		return{
			loading: true,
			issubmit: false,
			newService: false,
			modalTitle: "新增服务",
			returnPage: this.$route.query.page,
			clientId: this.$route.query.id,
			starttime: '',
			endtime: '',
			account: '',
			pwd: '',
			usernum: null,
			services: [],
			client: null,
			pageSize:10,
			pageCurrent:1,
			status:['未开通','已开通','已续接','已变更','已关闭'],
			colors:['yellow','green','blue','blue','red'],
			edit: null,
			option: 'new',
			timemin:{
				disabledDate:(date)=>{
					return date && date.valueOf() < new Date(this.starttime).valueOf() + 86400;
				}
			},
		}
	},
	methods:{
		showNew(){
			if( this.services.length > 0 ){
				if( this.services[0].status !== 1 ){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		},
		getService(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/client/service/list', {clientid: this.clientId})
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.services = res.data
					this.client = res.client
				}
				this.loading = false
			})
		},
		submit(){
			if( ( this.option!='admin'&&this.option!='reset'&&(!this.starttime || !this.endtime || !this.usernum) )
				||
				( this.option=='admin'&&(!this.account||!this.pwd) )
				/*||
				( this.option=='reset'&&!this.pwd )*/
			){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
			}

			if( this.account ){
				if( !/^[0-9a-zA-Z][0-9a-zA-Z_]{0,}$/.test(this.account) || this.account.length<6 || this.account.length>11 ){
					this.$Message.warning({content: '请输入6-11位的数字、字母、下划线组成的账号', duration: 3, closable: true});
					return;
				}
				if( this.pwd.length<5 || this.pwd.length>20 ){
					this.$Message.warning({content: '请输入6-20位的密码', duration: 3, closable: true});
					return;
				}
			}
			/*if( !this.account && this.pwd ){
				if( this.pwd.length<5 || this.pwd.length>20 ){
					this.$Message.warning({content: '请输入6-20位的密码', duration: 3, closable: true});
					return;
				}
			}*/
			if( this.usernum ){
				let flag = false
				let num = Number(this.usernum)
				if( isNaN(this.usernum) ){
					flag = true
				}else{
					if( num<1 || num>1000 || num%1 !== 0 ){
						flag = true
					}
				}
				if( flag ){
					this.$Message.warning({content: '服务人数为1-1000的整数', duration: 3, closable: true});
					return;
				}
			}

			let apiUrl = this.$store.state.apiUrl
			if( this.option === 'new' && !this.edit ){
				this.axios.post(apiUrl+'/client/service/new', {
					clientid: this.clientId,
					starttime: this.starttime, 
					endtime: this.endtime, 
					usernum: this.usernum})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newService = false
							this.clear()
							this.$Message.success({content: '创建成功', duration: 3, closable: true});
							this.getService()
						}else{
							this.$Message.error({content: '创建失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else if( this.option === 'edit' && this.edit ){
				this.axios.post(apiUrl+'/client/service/update', {
					clientid: this.clientId,
					serviceid: this.edit._id,
					starttime: this.starttime, 
					endtime: this.endtime, 
					usernum: this.usernum})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newService = false
							this.clear()
							this.$Message.success({content: '编辑成功', duration: 3, closable: true});
							this.getService()
						}else{
							this.$Message.error({content: '编辑失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else if( this.option === 'renewal' && this.edit ){
				this.axios.post(apiUrl+'/client/service/renewal', {
					clientid: this.clientId,
					serviceid: this.edit._id,
					endtime: this.endtime, 
					usernum: this.usernum})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newService = false
							this.clear()
							this.$Message.success({content: '续期成功', duration: 3, closable: true});
							this.getService()
						}else{
							this.$Message.error({content: '续期失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else if( this.option === 'change' && this.edit ){
				this.axios.post(apiUrl+'/client/service/change', {
					clientid: this.clientId,
					serviceid: this.edit._id,
					starttime: this.starttime,
					endtime: this.endtime, 
					usernum: this.usernum})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newService = false
							this.clear()
							this.$Message.success({content: '变更成功', duration: 3, closable: true});
							this.getService()
						}else{
							this.$Message.error({content: '变更失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}else if( this.option === 'admin' ){
				this.issubmit = true
				this.axios.post(apiUrl+'/client/update', {id: this.client._id, account: this.account, pwd: this.pwd})
				.then( response => response.data )
				.then( res => {
					if(!this.checkLogin(res))return;
					if( res.status == 1 ){
						this.newService = false
						this.clear()
						this.open()
					}else if( res.status == 2 ){
						this.newService = false
						this.clear()
						this.$Message.warning({content: res.msg, duration: 5, closable: true});
						this.issubmit = false
						return false
					}else if( res.status == 3 ){
						//this.newService = false
						//this.clear()
						this.$Message.warning({content: res.msg, duration: 5, closable: true});
						this.issubmit = false
						return false
					}else{
						this.$Message.error({content: '管理员账号创建失败，请稍后再试', duration: 3, closable: true});
						this.issubmit = false
						return false
					}
				})
			}/*else if( this.option === 'reset' ){
				this.axios.post(apiUrl+'/client/update', {
					id: this.clientId,
					resetpwd: this.pwd})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.newService = false
							this.clear()
							this.$Message.success({content: '重置成功', duration: 3, closable: true});
							//this.getService()
						}else{
							this.$Message.error({content: '重置失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}*/
		},
		/*resetPwd(){
			this.newService = true
			this.modalTitle = '重置管理员账号密码'
			this.option = 'reset'
		},*/
		doopen(sid){
			let flag = false
			for( let i=0;i<this.services.length;i++ ){
				if( this.services[i].status == 1 ){
					this.$Message.warning({content: '不能同时开通两个服务', duration: 3, closable: true});
					flag = true
					return;
				}
			}
			if( flag ){
				return false;
			}
			if( !this.client ){
				this.$Message.error({content: '开通失败，请刷新页面再试', duration: 3, closable: true});
				return false;
			}
			this.openid = sid

			if( !this.client.adminAccount || !this.client.adminPwd ){
				this.newService = true
				this.modalTitle = '新建管理员账号'
				this.option = 'admin'
			}else{
				this.open()
			}
		},
		open(){
			if( !this.openid ){
				this.$Message.error({content: '开通失败，请刷新页面再试', duration: 3, closable: true});
				this.issubmit = false
				return false;
			}

			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/client/service/open', {clientid: this.clientId, serviceid: this.openid})
			.then( response => response.data )
			.then( res => {
				this.openid = null
				this.issubmit = false
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.$Message.success({content: '开通成功', duration: 3, closable: true});
					this.getService()
				}
			})
		},
		close(sid){
			this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确定关闭该服务？</p>',
                onOk: () => {
                    let apiUrl = this.$store.state.apiUrl
					this.axios.post(apiUrl+'/client/service/close', {clientid: this.clientId, serviceid: sid})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.$Message.success({content: '关闭成功', duration: 3, closable: true});
							this.getService()
						}
						this.loading = false
					})
                },
                onCancel: () => {
                    //
                }
            })
		},
		del(sid){
			this.$Modal.confirm({
                title: '确认删除',
                content: '<p>确定删除该服务？</p>',
                onOk: () => {
                    let apiUrl = this.$store.state.apiUrl
					this.axios.post(apiUrl+'/client/service/remove', {clientid: this.clientId, serviceid: sid})
					.then( response => response.data )
					.then( res => {
						if(!this.checkLogin(res))return;
						if( res.status ){
							this.$Message.success({content: '删除成功', duration: 3, closable: true});
							this.getService()

							if( this.pageCurrent!=1 ){
			                	if( this.clients.length-1 <= (this.pageCurrent-1) * this.pageSize ){
			                		this.pageCurrent -= 1
			                	} 
			                }
						}
						this.loading = false
					})
                },
                onCancel: () => {
                    //
                }
            })
		},
		doedit(sid){
			if( !sid ) return;
			this.modalTitle = "编辑服务"
			this.newService = true
			this.option = 'edit'
			// 遍历services，找出当前编辑的用户
			for( let i=0;i<this.services.length;i++ ){
				if( this.services[i]._id === sid ){
					this.starttime = this.services[i].startTime
					this.endtime = this.services[i].endTime
					this.usernum = this.services[i].userNum
					this.edit = this.services[i]
				}
			}
		},
		renewal(sid){
			if( !sid ) return;
			this.modalTitle = "续期"
			this.newService = true
			this.option = 'renewal'
			// 遍历services，找出当前编辑的用户
			for( let i=0;i<this.services.length;i++ ){
				if( this.services[i]._id === sid ){
					this.starttime = this.services[i].endTime
					let endtime = new Date(this.services[i].endTime).valueOf()+86400000
					this.endtime = new Date( endtime )
					this.usernum = this.services[i].userNum
					this.edit = this.services[i]
				}
			}
		},
		change(sid){
			if( !sid ) return;
			this.modalTitle = "变更"
			this.newService = true
			this.option = 'change'
			// 遍历services，找出当前编辑的用户
			for( let i=0;i<this.services.length;i++ ){
				if( this.services[i]._id === sid ){
					this.starttime = this.services[i].startTime
					this.endtime = this.services[i].endTime
					this.usernum = this.services[i].userNum
					this.edit = this.services[i]
				}
			}
		},
		changepage(num){
			this.pageCurrent = num
		},
		cancel(){
			this.newService = false
			this.clear()
		},
		clear(){
			this.starttime = ''
			this.endtime = ''
			this.usernum = null
			this.modalTitle = "新增服务"
			this.edit = null
			this.option = 'new'
			this.account = ''
			this.pwd = ''
		},
		turnback(){
			this.$router.push({
				path: '/client', 
				query: {page: this.returnPage}
			})
		}
	},
	computed:{
		showService(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('client')>=0 : flase
		}
	},
	mounted(){
		this.getService()
	}
}	
</script>

<style scoped>
.ivu-date-picker{
	display: inline-block;
	width: 250px !important;
}
.ivu-input-type{
	display: inline-block;
    width: 250px;
}
.service-option{
	position: relative;
}
.service-option .add{
	margin-left: 10px;
}
.ivu-timeline .tr{
	display: inline-flex;
	width: 100%;
    align-items: center;
    background-color: #f8f8f9;
    padding: 10px;
    border-radius: 5px;
}
.ivu-timeline .tr td{
	width: 180px;
}
.ivu-timeline p.time{
	font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
}
.ivu-timeline{
	padding: 0 20px;
}
.ivu-timeline .tr td.service-option{
	border-radius: 5px;
	width: 280px;
}
.client-name{
	position: absolute;
    font-size: 14px;
    line-height: 36px;
    left: 45%;
    display: inline-block;
    text-align: center;
}
</style>