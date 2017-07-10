<template>
    <div class="bill" v-show="showBill">
        <div class="contents">
        	<div class="layout-content-main">
        		<div class="user-option options">
        			<div class="search">
	            		<Input v-model="search" placeholder="客户名" style="width:150px"></Input>
					    <Date-picker :editable="false" v-model="date" type="month" placeholder="月份" 
					    style="width:100px;margin-right:15px"></Date-picker>
					    <Button @click="dosearch()">查询</Button>
					    <Button class="clear-search" type="dashed" icon="ios-close-outline" @click="clearSearch()"
					    v-show="bills.length!=billArr.length">清除</Button>
            		</div>
            		<Button type="primary" @click="exportBill()" class="export">导出账单</Button>
        		</div>
        		<div class="bill-lists">
            		<Table border size="small" :columns="columns" :data="showbill" @on-selection-change="selectChange"></Table>
        		</div>
        		<Spin fix v-show="loading">
	                <Icon type="load-c" size=36 class="demo-spin-icon-load"></Icon>
	            </Spin>
	            <div class="paginator">
        			<Page 
        			:total="bills.length" 
        			:page-size="pageSize" 
        			:current="pageCurrent" 
        			@on-change="changepage"
        			show-elevator></Page>
        		</div>
        		<!-- <pre>{{bills}}</pre> -->
        	</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'bill',
	data(){
		return{
			loading: true,
			columns:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '客户名称',
                    key: 'clientName'
                },
                {
                    title: '月份',
                    key: 'month'
                },
                {
                    title: '账单金额',
                    key: 'settle',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'social-yen'
                                },
                                style: {
                                    marginRight: '3px'
                                },
                            }),
                            h('strong', params.row.settle+' 元'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: "arrow-right-c"
                                },
                                style: {
                                	float: 'right'
                                    //marginLeft: '15px'
                                },
                                on: {
                                    click: () => {
                                        this.showBillDetail(params.row._id)
                                    }
                                }
                            }, '账单明细'),
                        ]);
                    }
                }
            ],
			bills: [],
			billArr: [],
			searchmode:'client',
			searchtype:[{
				label: '客户名称',
				value: 'name'
			},{
				label: '月份',
				value: 'parent'
			}],
			search:'',
			date: null,
			pageSize: 10,
			pageCurrent: 1,
			selected: null,
			pageSize: 15,
			pageCurrent: 1,
			showbill: []
		}
	},
	methods:{
		getBills(){
			let apiUrl = this.$store.state.apiUrl
			this.axios.get(apiUrl+'/bill/list')
			.then( response => response.data )
			.then( res => {
				if(!this.checkLogin(res))return;
				if( res.status ){
					this.bills = res.data
					this.billArr = res.data
					this.paginate()
				}
				this.loading = false
			})
		},
		exportBill(){
			if( !this.selected || this.selected.length==0 ){
				this.$Message.warning({content: '请选择要导出的账单', duration: 3, closable: true});
				return;
			}
			let selected = ''
			selected = this.selected.join(',')
			selected = encodeURI(selected)
			let apiUrl = this.$store.state.apiUrl
			apiUrl += '/bill/export?p='+selected
			this.exportUrl = apiUrl
			window.open(apiUrl)
			
			//window.location = apiUrl+'/bill/export'
		},
		showBillDetail(id){
			this.$router.push({
				path: '/bill/detail', 
				query: {id: id}
			})
		},
		changepage(num){
			this.pageCurrent = num
			this.paginate()
		},
		dosearch(){
			if( !this.search && !this.date ){
				this.$Message.warning({content: '请输入搜索内容', duration: 3, closable: true});
				return;
			}
			let bills = [];

			if( this.search && this.date ){
				for(let i=0;i<this.billArr.length;i++){
					if( this.billArr[i].clientName.indexOf(this.search)>=0 && this.billArr[i].month-1==new Date(this.date).getMonth() ){
						bills.push(this.billArr[i])
					}
				}
			}else if( this.search ){
				for(let i=0;i<this.billArr.length;i++){
					if( this.billArr[i].clientName.indexOf(this.search)>=0 ){
						bills.push(this.billArr[i])
					}
				}
			}else if( this.date ){
				for(let i=0;i<this.billArr.length;i++){
					if( this.billArr[i].month-1==new Date(this.date).getMonth() ){
						bills.push(this.billArr[i])
					}
				}
			}
			
			this.bills = bills
			this.pageCurrent = 1
			this.paginate()
		},
		clearSearch(){
			this.bills = this.billArr
			this.search = ''
			this.date = null
			this.pageCurrent = 1
			this.paginate()
		},
		paginate(){
			this.showbill = this.bills.slice( (this.pageCurrent-1)*this.pageSize, (this.pageCurrent-1)*this.pageSize+this.pageSize)
		},
		selectChange(selection){
			this.selected = selection.map(function(item){
				return item._id
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
		this.getBills()
	}
}
</script>

<style scoped>
.search{margin-left: 0}
.export{float: right;}
</style>
