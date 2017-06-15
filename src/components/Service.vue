<template>
	<div class="service" v-show="showService">
		<div class="contents">
			<div class="layout-content-main">
				<div class="service-option options">
            		<Button type="info" @click="newService = true">新增客户</Button>

            	</div>
            	<div class="service-lists">
	        		<table>
	        			<thead>
	        				<tr>
	        					<td>服务状态</td>
	        					<td>开始时间</td>
	        					<td>截止时间</td>
	        					<td>服务人数</td>
	        					<td>操作</td>
	        				</tr>
	        			</thead>
	        			<tbody>
	        				<tr v-for="(service,index) in services"
	        				v-if="index>=(pageCurrent-1)*pageSize && index<pageCurrent*pageSize">
	        					<td>{{status[service.status]}}</td>
	        					<td>{{changeTime(service.startTime)}}</td>
	        					<td>{{changeTime(service.endTime)}}</td>
	        					<td>{{service.userNum}}</td>
	        					<td>
	        						<template v-if="service.status===0">
	        							<Button type="success" @click.stop="open(client._id)">开通</Button>
	        							<Button type="info" @click.stop="edit(client._id)">编辑</Button>
	        							<Button type="error" @click.stop="del(client._id)">删除</Button>
	        						</template>
	        						<template v-if="service.status===1">
	        							<Button type="success" @click.stop="renewal(client._id)">续借</Button>
	        							<Button type="info" @click.stop="change(client._id)">变更</Button>
	        							<Button type="error" @click.stop="close(client._id)">关闭</Button>
	        						</template>
	        					</td>
	        				</tr>
	        			</tbody>
	        		</table>
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
	        	<pre>{{services}}</pre>
			</div>
			
		</div>
		<Modal @on-ok="submit" @on-cancel="cancel"
	        :title="modalTitle"
	        v-model="newService"
	        :mask-closable="false">
	        <p>
	        	<span class="input-label">开通时间</span>
	        	<Date-picker v-model="starttime" type="date" placeholder="选择开始日期" style="width: 200px"></Date-picker>
	        </p>
	        <p>
	        	<span class="input-label">截止时间</span>
	        	<Date-picker v-model="endtime" type="date" placeholder="选择截止日期" style="width: 200px"></Date-picker>
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
			clientId: this.$route.query.id,
			starttime: '',
			endtime: '',
			usernum: null,
			services: [],
			pageSize:10,
			pageCurrent:1,
			status:['未开通','已开通','已续接','已变更','已关闭']
		}
	},
	methods:{
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
			if( this.modalTitle === '新增服务' && !this.edit ){
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
			}else{
				this.axios.post(apiUrl+'/client/service/update', {
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
							this.$Message.success({content: '更新成功', duration: 3, closable: true});
							this.getService()
						}else{
							this.$Message.error({content: '更新失败，请重新尝试！', duration: 3, closable: true});
						}
					})
			}
		},
		open(){},
		edit(){},
		del(){},
		renewal(){},
		change(){},
		cloae(){},
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
</style>