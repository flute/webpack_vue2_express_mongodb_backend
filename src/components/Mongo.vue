<template>
	<div class="mongo">
		<div class="option">
			<Button @click="insert()" type="success">insert</Button>
			<Button @click="update()" type="info">update</Button>
			<Button @click="remove()" type="error">remove</Button>
		</div>
		<pre>{{list}}</pre>
	</div>
</template>

<script>
export default {
	name: 'mongo',
	data(){
		return {
			msg: 'Welcome to Your Vue.js App',
			list: null
		}
	},
	methods: {
		getList(){
			this.axios.get('/mongo/list')
			.then(res => {
				this.list = res.data
			})
			.catch(function (err) {
				console.error(err)
			})
		},
		insert(){
			this.axios.get('/mongo/insert')
			.then(res => {
				//this.list = res.data
				this.getList()
			})
			.catch(function (err) {
				console.error(err)
			})
		},
		update(){
			this.axios.get('/mongo/update')
			.then(res => {
				this.getList()
			})
			.catch(function (err) {
				console.error(err)
			})
		},
		remove(){
			this.axios.get('/mongo/remove')
			.then(res => {
				this.getList()
			})
			.catch(function (err) {
				console.error(err)
			})
		}
	},
	mounted(){
		this.getList()
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
pre{
	text-align: left;
	font-size: 12px;
	border: 1px solid #dddee1;
    padding: 5px;
    border-radius: 5px;
    overflow: auto;
}
</style>
