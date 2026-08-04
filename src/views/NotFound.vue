<template>
  <div class="tool-container text-center py-20">
    <p class="text-8xl mb-6">🔍</p>
    <h1 class="text-4xl font-bold mb-4" style="color: var(--text);">404</h1>
    <p class="text-lg mb-8" style="color: var(--text-secondary);">{{ t('not-found') }}</p>
    <router-link to="/" class="btn-primary inline-block no-underline">🏠 {{ t('back-home') }}</router-link>
  </div>
</template>

<script setup>
import { t } from '../i18n'
</script>
