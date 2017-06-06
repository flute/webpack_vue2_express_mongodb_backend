<template>
    <div class="bonus" v-show="showBonus">
        <div class="contents">
            <div class="layout-content-main">积分规则设定</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'bonus',
	computed:{
		showBonus(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('bonus')>=0 : flase
		},
	}
}
</script>

<style>

</style>


