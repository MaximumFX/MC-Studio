<template>
	<main>
		<navbar>
			<router-link to="/" class="nav-link active"><icon icon="arrow_back" em-sizing :optical-size="24"/> Back</router-link>
		</navbar>
		<section>
			<div class="flex h-full">
				<div class="w-1/4 p-4 bg-mcs-secondary">
					<h3 class="mb-3">{{ name }}</h3>
					<p v-if="description">{{ description }}</p>
					<t-button class="w-full" @click="newItem">Open {{ openType }}</t-button>
					<hr>
					<div v-if="todo.length">
						<h4 class="text-yellow-400"><i class="fa-regular fa-construction"/> Todo</h4>
						<ul>
							<li v-for="(item, i) of todo" :key="i">{{ item }}</li>
						</ul>
					</div>
				</div>
				<div class="w-3/4 h-full overflow-y-auto">
					<div v-if="recent === undefined" class="h-full flex items-center justify-center">
						<loader/>
					</div>
					<div v-else-if="recent.length" class="p-4">
						<h4>Recent</h4>
						<table class="w-full">
							<colgroup>
								<col span="1" style="width: 50%;">
								<col span="1" style="width: 30%;">
								<col span="1" style="width: 15%;">
								<!--<col span="1" style="width: auto;">-->
							</colgroup>

							<thead class="text-left">
								<tr>
									<th scope="col">Name</th>
									<th scope="col">{{ textDate }}</th>
									<th scope="col">Size</th>
									<!--<th scope="col"></th>-->
								</tr>
							</thead>
							<tbody>
								<tr v-for="(file, i) in recent" :key="i" @click="itemClick(file)">
									<td>
										<p class="mb-1">{{ file.name }}</p>
										<p class="truncate text-muted text-sm" :title="file.path">{{ file.file }}</p>
										<p v-if="isDev" class="truncate text-muted text-sm" :title="file.uuid">{{ file.uuid }}</p>
									</td>
									<td>{{ file.lastOpened }}</td>
									<td>{{ file.size }}</td>
									<!--<td>...</td>-->
								</tr>
							</tbody>
						</table>
					</div>

					<div v-else class="flex flex-col items-center justify-center h-full">
						<h6 class="display-6">You don't have any recent {{ openType }}s</h6>
						<img src="https://static.wikia.nocookie.net/minecraft-computer/images/1/1f/Dead_Bush.png" alt="Dead bush" width="128" class="mb-3">
						<!--todo local deadbush -->
						<t-button @click="newItem">Open file</t-button>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import Navbar from '@/components/core/Navbar';
import Icon from '@/components/core/Icon';
import TButton from '@/components/core/TButton';
import Loader from '@/components/core/Loader';

export default {
	name: 'Homepage',
	components: {Loader, TButton, Icon, Navbar},
	props: {
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: undefined,
		},
		openType: {
			type: String,
			default: () => 'file',
		},
		textDate: {
			type: String,
			default: () => 'Last opened',
		},
		todo: {
			type: Array,
			default: () => [],
		},
		recent: {
			type: Array,
			default: () => undefined,
		},
		newItem: {
			type: Function,
			required: true,
		},
		itemClick: {
			type: Function,
			required: true,
		},
	},
	data() {
		return {
			isDev: window.vars.IS_DEV,
		}
	},
}
</script>

<style scoped>
table {
	table-layout: fixed;
}
tbody tr {
	cursor: pointer;
	@apply hover:bg-gray-700
}
</style>
