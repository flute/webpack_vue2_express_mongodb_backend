<template>
    <div class="resource" v-show="showResource">
        <div class="contents">
            <div class="layout-content-main">资源配置</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'resource',
	computed:{
		showResource(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('resource')>=0 : flase
		},
	}
}
</script>

<style>

</style>


