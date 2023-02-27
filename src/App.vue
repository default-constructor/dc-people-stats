<script setup lang="ts">
import NavMenu from '@/components/NavMenu.vue'
</script>

<template>
  <nav  id="app-nav" ref="navRef">
    <NavMenu></NavMenu>
  </nav>

  <router-view v-slot="{Component}">
    <suspense>
      <main>
        <component :is="Component"/>
      </main>
    </suspense>
  </router-view>

  <footer id="app-footer">
    <div>
    </div>
  </footer>
</template>
