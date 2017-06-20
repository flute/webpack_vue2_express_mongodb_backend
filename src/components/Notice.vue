<template>
	<div class="notice">
		<template v-for="item in getNotice">
			<p class="notice-item">
				<!-- <Icon type="android-notifications-none" size="12" :color="item.haveRead?'green':'red'"></Icon> 
				<span>{{item.content}}</span> -->
				<Tag type="dot" :color="item.haveRead?'blue':'red'">{{item.content}}</Tag>
			</p>
			
			
		</template>
		<p class="notip" v-show="!getNotice || getNotice.length==0">暂无消息~</p>
		<!-- <pre>{{getNotice}}</pre> -->
	</div>
</template>

<script>
export default {
	name: 'notice',
	methods:{
		hasRead(){
			var id = this.getNotice.map(function(item){
				return item._id
			})

			let apiUrl = this.$store.state.apiUrl
			this.axios.post(apiUrl+'/hasread', {
				id: id
			})
			.then(response => response.data)
			.then(res => {
				if( res.status === 1 ){
					//
				}else{
					// 
				}
			})
		}
	},
	computed:{
		getNotice(){
			return this.$store.state.notice?this.$store.state.notice.reverse():null
		}
	},
	mounted(){
		if( this.$store.state.notice && this.$store.state.notice.length>0 ){
			this.hasRead()
		}
	},
	destroyed(){
		var notice = this.getNotice.map(function(item){
			item.haveRead = 1
			return item
		})
		this.$store.commit('updateNotice', notice)
	}
}
</script>

<style scoped>
.notice-item{
	padding: 10px;
    border-radius: 5px;
    width: 100%;
}
.notice-item span{
	margin-left: 20px;
}
.notice-item div{
	width: 90%;
    background: #f8f8f9 !important;
}
.notice{
	padding: 20px 10px;
}
</style>
