<template>
	<nav class="flex no-select shadow-md items-center z-50 px-4 bg-mcs-secondary">
		<slot/>
	</nav>
</template>

<script>
export default {
	name: 'Navbar',
};
</script>

<style scoped>
nav {
	height: 3.5rem;
}
</style>
