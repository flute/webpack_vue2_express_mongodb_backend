<template>
    <div class="billdetail" v-show="showBill">
        <div class="contents">
        	<div class="layout-content-main">
        		<div class="bill-lists">
            		<Table border size="small" :columns="columns" :data="details"></Table>
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

<style scoped></style>
