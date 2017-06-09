<template>
    <div class="version" v-show="showVersion">
        <div class="contents">
            <div class="layout-content-main">
            	<h2>版本控制</h2>
            	<table>
            		<tr>
            			<td v-for="item in table">
	            			{{item.name}}
	            		</td>
            		</tr>
            		<tr>
            			<td v-for="item in table">
	            			{{item.value}}
	            		</td>
            		</tr>
            	</table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'version',
	data(){
		return{
			table:[{
				name: '_id',
				value: 'ID'
			},{
				name: 'createdAt',
				value: '创建时间'
			},{
				name: 'updateAt',
				value: '更新时间'
			},{
				name: 'desc',
				value: '版本描述'
			},{
				name: 'name',
				value: '产品名称，分组标识'
			},{
				name: 'paltfrom',
				value: '平台：ios/android'
			},{
				name: 'pubStatus',
				value: '是否发布'
			},{
				name: 'updateAddr',
				value: '更新地址'
			},{
				name: 'updateType',
				value: '更新类型：强制更新、选择更新'
			},{
				name: 'version',
				value: '版本号'
			}]
		}
	},
	computed:{
		showVersion(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('version')>=0 : flase
		},
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


