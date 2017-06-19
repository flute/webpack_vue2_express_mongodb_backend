<template>
	<div class="notice">
		<template v-for="item in getNotice">
			<p class="notice-item">
				<Icon type="android-notifications-none" size="12" color="red"></Icon> 
				<span>{{item.content}}</span>
			</p>
		</template>
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
			return this.$store.state.notice
		}
	},
	mounted(){
		if( this.$store.state.notice && this.$store.state.notice.length>0 ){
			this.hasRead()
		}
	},
	destroyed(){
		this.$store.commit('updateNotice', null)
	}
}
</script>

<style scoped>
.notice-item{
	padding: 10px;
    margin-bottom: 10px;
    background-color: #f8f8f9;
    border-radius: 5px;
    width: 90%;
}
.notice-item span{
	margin-left: 20px;
}
.notice{
	padding: 20px 10px;
}
</style>
