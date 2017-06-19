<template>
	<div class="service" v-show="showService">
		<div class="contents">
			<div class="layout-content-main">
				<div class="service-option options">
					<Button type="primary" icon="arrow-left-c" @click="turnback">返回</Button>
            		<Button class="add" type="info" @click="newService = true" v-show="showNew()">新增服务</Button>
            	</div>
            	<div class="service-lists">
				    <Timeline>
				    	<template v-for="(service,index) in services"
        				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
				    		<Timeline-item :color="colors[service.status]" >
		        				<p class="time">{{status[service.status]}}</p>
		            			<p class="content">
		            				<tr class="tr">
			        					<td>服务开始时间：<b>{{changeTime(service.startTime)}}</b></td>
			        					<td>服务截止时间：<b>{{changeTime(service.endTime)}}</b></td>
			        					<td>服务人数：<b>{{service.userNum}}</b> 人</td>
			        					<td v-if="service.closeAt">关闭时间：<b>{{changeTime(service.closeAt)}}</b></td>
			        					<td class="service-option">
			        						<template v-if="service.status===0">
			        							<Button type="success" @click.stop="open(service._id)">开通</Button>
			        							<Button type="info" @click.stop="doedit(service._id)">编辑</Button>
			        							<Button type="error" @click.stop="del(service._id)">删除</Button>
			        						</template>
			        						<template v-if="service.status===1">
			        							<Button type="success" @click.stop="renewal(service._id)">续借</Button>
			        							<Button type="info" @click.stop="change(service._id)">变更</Button>
			        							<Button type="error" @click.stop="close(service._id)">关闭</Button>
			        						</template>
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
	        <p>
	        	<span class="input-label">开通时间</span>
	        	<Date-picker v-model="starttime" type="date" :disabled="option==='renewal'" placeholder="选择开始日期" style="width: 200px"></Date-picker>
	        </p>
	        <p>
	        	<span class="input-label">截止时间</span>
	        	<Date-picker v-model="endtime" type="date" :options="timemin" placeholder="选择截止日期" style="width: 200px"></Date-picker>
	        </p>
	        <p>
	        	<span class="input-label">服务人数</span>
	        	<Input-number :min="1" v-model="usernum" placeholder="请输入服务人数" style="width: 250px"></Input-number>
	        </p> 
	        <div slot="footer">
	            <Button @click="cancel()">取消</Button>
	            <Button type="success" @click="submit()">确认</Button>
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
			newService: false,
			modalTitle: "新增服务",
			returnPage: this.$route.query.page,
			clientId: this.$route.query.id,
			starttime: '',
			endtime: '',
			usernum: null,
			services: [],
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
				if( this.services[this.services.length-1].status !== 1 ){
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
				}
				this.loading = false
			})
		},
		submit(){
			if( !this.starttime || !this.endtime || !this.usernum ){
				this.$Message.warning({content: '请填写完整信息', duration: 3, closable: true});
				return;
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
			}
		},
		open(sid){
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/client/service/open', {clientid: this.clientId, serviceid: sid})
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.$Message.success({content: '开通成功', duration: 3, closable: true});
					this.getService()
				}
				this.loading = false
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
	/*flex: 1;*/
	width: 200px;
}
/*.ivu-timeline .tr td.service-option{
	flex: 2
}
*/.ivu-timeline p.time{
	font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
}
.ivu-timeline{
	padding: 0 20px;
}
.service-option{
	border-radius: 5px;
}
</style>