<template>
    <div class="billdetail" v-show="showBill">
        <div class="contents">
        	<div class="layout-content-main">
        		<div class="service-option options">
					<Button type="primary" icon="arrow-left-c" @click="turnback">返回</Button>
            		<span class="client-name">{{details&&details.length>0?details[0].clientName:''}}</span>
            	</div>
        		<div class="bill-lists">
            		<!-- <Table border size="small" :columns="columns" :data="details"></Table> -->
            		<Timeline>
				    	<template v-for="(service,index) in details">
				    		<Timeline-item :color="colors[service.status]">
		        				<p class="time">{{status[service.status]}}</p>
		            			<p class="content">
		            				<tr class="tr">
		            					<td>操作时间：<b>{{changeTime(service.createAt)}}</b></td>
			        					<td>开始时间：<b>{{changeTime(service.startTime)}}</b></td>
			        					<td>截止时间：<b>{{changeTime(service.endTime)}}</b></td>
			        					<td>人数：<b>{{service.userNum}}</b> 人</td>
			        					<td v-if="service.month==0||service.month">时长：<b>
			        					{{service.month[0]?service.month[0]:''}}<span v-if="service.month[0]">月</span>
			        					{{service.month[1]?service.month[1]:''}}<span v-if="service.month[1]">天</span>
			        					</b></td>
			        					<td>金额：<b>{{service.settle}}</b> 元</td>
			        					<td>变更差额：<b>{{service.difference?(service.difference>0?'+'+service.difference:service.difference):0}}</b> 元</td>
			        				</tr>
		            			</p>
		        			</Timeline-item>
				    	</template>
        			</Timeline>
					<p class="notip" v-show="details.length==0">暂无数据</p>
        		</div>
        		<Spin fix v-show="loading">
	                <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
	            </Spin>
        	</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'billdetail',
	data(){
		return{
			loading: true,
			details: [],
			billId: this.$route.query.id,
			returnPage: this.$route.query.page,
			status:['未开通','已开通','已续接','已变更','已关闭'],
			colors:['yellow','green','blue','blue','red'],
			columns:[
                {
                    title: '月份',
                    key: 'month'
                },
                {
                    title: '服务开始时间',
                    key: 'createAt',
                    render: (h, params) => {
                        return h('span', this.changeTime(params.row.createAt));
                    }
                },
                {
                    title: '服务结束时间',
                    key: 'endTime',
                    render: (h, params) => {
                        return h('span', this.changeTime(params.row.createAt));
                    }
                },
                {
                    title: '服务人数',
                    key: 'userNum'
                },
                {
                    title: '金额',
                    key: 'settle'
                },
                {
                    title: '差额',
                    key: 'difference'
                }
            ],			
		}
	},
	methods:{
		getBillDetail(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/bill/detail', {id: this.billId})
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.details = res.data
				}
				this.loading = false
			})
		},
		turnback(){
			this.$router.push({
				path: '/bill', 
				query: {page: this.returnPage}
			})
		}
	},
	computed:{
		showBill(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('bill')>=0 : flase
		}
	},
	mounted(){
		this.getBillDetail()
	}
}
</script>

<style scoped>
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
