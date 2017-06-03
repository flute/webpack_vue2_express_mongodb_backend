<template>
    <div class="version" v-show="showVersion">
        <div class="contents">
            <div class="layout-content-main">版本控制</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'version',
	computed:{
		showVersion(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('version')>=0 : flase
		},
	}
}
</script>

<style>

</style>


