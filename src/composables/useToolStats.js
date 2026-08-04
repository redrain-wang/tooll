import { ref, onMounted } from 'vue'

const RECENT_KEY = 'toolbox_recent'
const FAVORITE_KEY = 'toolbox_favorites'
const STATS_KEY = 'toolbox_stats'

export function useToolStats() {
  const recent = ref([])
  const favorites = ref([])
  const stats = ref({})

  onMounted(() => {
    try { recent.value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { recent.value = [] }
    try { favorites.value = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '[]') } catch { favorites.value = [] }
    try { stats.value = JSON.parse(localStorage.getItem(STATS_KEY) || '{}') } catch { stats.value = {} }
  })

  function trackUse(toolPath) {
    // Add to recent
    recent.value = [toolPath, ...recent.value.filter(p => p !== toolPath)].slice(0, 10)
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value))
    // Increment stats
    stats.value[toolPath] = (stats.value[toolPath] || 0) + 1
    localStorage.setItem(STATS_KEY, JSON.stringify(stats.value))
  }

  function toggleFavorite(toolPath) {
    if (favorites.value.includes(toolPath)) {
      favorites.value = favorites.value.filter(p => p !== toolPath)
    } else {
      favorites.value = [...favorites.value, toolPath]
    }
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites.value))
  }

  function isFavorite(toolPath) {
    return favorites.value.includes(toolPath)
  }

  function getRecent() { return recent.value }
  function getFavorites() { return favorites.value }
  function getStats() { return stats.value }

  return { recent, favorites, stats, trackUse, toggleFavorite, isFavorite, getRecent, getFavorites, getStats }
}
