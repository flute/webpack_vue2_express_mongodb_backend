<template>
    <div class="settlement" v-show="showSettlement">
        <div class="contents">
            <div class="layout-content-main">结算</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'settlement',
	computed:{
		showSettlement(){
			let permission = this.$store.state.permissions
			return permission ? permission.dom.indexOf('settlement')>=0 : flase
		},
	}
}
</script>

<style>

</style>


