import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const toolModules = [
  'JsonFormatter','Base64','Timestamp','RegexTester','QrCode','PasswordGenerator',
  'WordCounter','UrlEncoder','ColorConverter','UuidGenerator','Markdown',
  'ImageBase64','TextDiff','NumberBase','HtmlEscape','CronGenerator',
  'LoremIpsum','JsonToCsv','ColorPalette','HashGenerator','TextToSlug','MdToHtml',
  'TextDedup','TextSort','TextReverse','CaseConverter','TextReplace','Notepad','TextAscii',
  'JwtDecoder','XmlFormatter','CssMinify','JsMinify','HtmlFormatter','RegexCheatsheet','RegexLib',
  'AesEncrypt','RandomNumber','MorseCode','UnitConverter','RmbUppercase','NumberChinese',
  'UserAgent','UrlParser','DateCalc','Countdown','Stopwatch','Pomodoro','ColorBlind',
  'CharInfo','Barcode','ImageInfo','GradientGenerator','TextStats','PasswordStrength','PasswordBatch','HexRgb',
  'ImageCompress','JsonTree','RegexVisual','QrScanner','DeviceInfo','Clipboard','TableGenerator',
  'RsaGenerator','ColorExtract','SpeedTest','PasswordVault','TextCompare',
  'Translator','ImageEditor','ImageCrop','FaviconGen',
  'SvgEditor','CodeFormatter','JsonSchemaGen','JsonExcel','RegexBuilder','ColorContrast','MetaTagGen','ColorPicker','ColorMixer','PromptLibrary','ApiTester','CssAnimation','QrBeautify','ImageToSvg','SvgExport','JsonpGenerator','LoremImage','ImageFormat','RegexExplainer','CssUnit','HtmlPreview','TextToSpeech','ColorHarmony','TextCipher','CssGrid','TextHandwriting','MdTable','RegexHighlight','TimestampEnhanced',
  'JsonToTs','JsonToSql','EmojiPicker','SqlFormatter','CsvToJson','CssToTailwind',
]

function toKebab(s){return s.replace(/([A-Z])/g,'-$1').toLowerCase().replace(/^-/,'')}

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'ToolBox - 108+ Free Online Tools', description: 'Free online toolbox with 108+ tools for developers, designers, and productivity. JSON formatter, regex tester, color picker, and more.' } },
  { path: '/category/:key', name: 'Category', component: () => import('../views/Category.vue'), meta: { title: 'Category - ToolBox' } },
  ...toolModules.map(m => ({
    path: '/' + toKebab(m), name: m,
    component: () => import(`../views/tools/${m}.vue`),
    meta: { title: toKebab(m).replace(/-/g,' ') + ' - ToolBox', description: 'Free online ' + toKebab(m).replace(/-/g,' ') + ' tool. Use it now!' }
  })),
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior() { return { top: 0 } } })
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