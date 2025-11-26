<script setup lang="ts">
import HeaderUser from '@/components/HeaderUser.vue'
import Sidebar from '@/components/Sidebar.vue'
import { ref, onMounted, computed } from 'vue'
import useToast from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import ToastContainer from '@/components/ToastContainer.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Responsive helper
const isDesktop = computed(() => window?.innerWidth > 600)

// Detect if we're on login page
const isLoginPage = computed(() => route.name === 'login')

// Sidebar states
const isSidebarOpen = ref(true)
const isExpanded = ref(true) // new state for expanded/collapsed

// Load saved preferences
onMounted(() => {
  const savedExpanded = localStorage.getItem('sidebarExpanded')
  const savedOpen = localStorage.getItem('sidebarOpen')
  
  // Set expanded state (desktop mode)
  isExpanded.value = savedExpanded !== null ? savedExpanded === 'true' : true
  
  // Set open state (mobile mode)
  if (window.innerWidth <= 600) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = savedOpen !== null ? savedOpen === 'true' : true
  }
})

// Toggle sidebar visibility (mainly for mobile)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  localStorage.setItem('sidebarOpen', isSidebarOpen.value.toString())
}

// Toggle sidebar expanded state (mainly for desktop)
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  localStorage.setItem('sidebarExpanded', isExpanded.value.toString())
}

const userName = ref('Kevin Escobar')
const avatar = ref('') // set an URL if available
const { push: pushToast } = useToast()
const { t } = useI18n()

function onConfigure() {
  // lightweight feedback via toast
  pushToast(t('headerUser.configure'), 'info')
}

function onLogout() {
  // Redirect to login
  router.push({ path: '/login' })
}

// no local contacts here any more; routed views will render their own content
</script>

<template>
	<div v-if="isLoginPage" class="login-full-screen">
		<router-view />
		<ToastContainer />
	</div>
	<div v-else class="app-shell">
		<Sidebar :is-expanded="isExpanded" />

		<div class="content-area">
			<header class="topbar">
				<div class="topbar__left">
					<button 
						class="hamburger" 
						@click="isDesktop ? toggleExpanded() : toggleSidebar()" 
						:aria-expanded="isDesktop ? isExpanded : isSidebarOpen" 
						aria-controls="main-sidebar" 
						:title="isDesktop ? (isExpanded ? 'Colapsar menú' : 'Expandir menú') : 'Toggle sidebar'"
					>☰</button>
				</div>
				<div class="topbar__right">
					<HeaderUser :username="userName" :avatarUrl="avatar" @configure="onConfigure" @logout="onLogout" />
				</div>
			</header>

									<main class="main">
											<router-view />
									</main>
		</div>
		<ToastContainer />
	</div>
</template>

<style scoped>
.login-full-screen {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}

.app-shell{display:flex;height:100vh;overflow:hidden}
.content-area{flex:1;display:flex;flex-direction:column;background:#f6f8fb}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 1rem;border-bottom:1px solid rgba(16,24,40,0.04);background:#ffffff}
.hamburger{background:transparent;border:none;font-size:1.1rem;cursor:pointer}
.main{padding:1.2rem;overflow:auto;height: 100%}
.controls{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
</style>