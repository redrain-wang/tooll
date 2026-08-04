import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import { TOOLS, toModule } from '../data/tools'

// 工具组件懒加载由 dynamic import 完成，路径无需枚举
const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'ToolBox - 108+ Free Online Tools', description: 'Free online toolbox with 108+ tools for developers, designers, and productivity. JSON formatter, regex tester, color picker, and more.' } },
  { path: '/category/:key', name: 'Category', component: () => import('../views/Category.vue'), meta: { title: 'Category - ToolBox' } },
  ...TOOLS.map(t => ({
    path: t.path, name: toModule(t.path),
    component: () => import(`../views/tools/${toModule(t.path)}.vue`),
    meta: { title: t.path.slice(1).replace(/-/g, ' ') + ' - ToolBox', description: 'Free online ' + t.path.slice(1).replace(/-/g, ' ') + ' tool. Use it now!' }
  })),
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

function resolveBase() {
  if (typeof window === 'undefined') return '/'
  const baseEl = document.querySelector('base')
  let base = baseEl && baseEl.getAttribute('href') || window.location.pathname
  base = base.replace(/\/[^/]*$/, '/')
  if (base[0] !== '/') base = '/' + base
  return base
}

const router = createRouter({ history: createWebHistory(resolveBase()), routes, scrollBehavior() { return { top: 0 } } })
router.afterEach((to) => {
  document.title = to.meta.title || 'ToolBox - Free Online Tools'
  let desc = document.querySelector('meta[name="description"]')
  if (!desc) { desc = document.createElement('meta'); desc.name = 'description'; document.head.appendChild(desc) }
  desc.content = to.meta.description || 'Free online toolbox with 100+ tools for developers and designers.'

  let ld = document.querySelector('script[data-jsonld]')
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.setAttribute('data-jsonld',''); document.head.appendChild(ld) }
  const title = to.meta.title || 'ToolBox - Free Online Tools'
  const jsonld = {
    '@context':'https://schema.org',
    '@type':'WebApplication',
    name: title.replace(' - ToolBox',''),
    description: desc.content,
    url: 'https://tooll.cc.cd' + to.path,
    applicationCategory:'DeveloperApplication',
    operatingSystem:'Any',
    offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}
  }
  ld.textContent = JSON.stringify(jsonld)
})
export default router