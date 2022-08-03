<template>
	<ControlBar/>
	<router-view/>
	<AppProgress/>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ControlBar from '@/components/ControlBar.vue';
import AppProgress from '@/components/AppProgress.vue';
</script>

<style>

</style>
