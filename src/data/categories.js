export const categories = [
  {
    key: 'text', icon: '📝', labelKey: 'cat-text',
    tools: [
      {p:'/json-formatter',k:'json-formatter'},{p:'/markdown',k:'markdown'},{p:'/md-to-html',k:'md-to-html'},
      {p:'/word-counter',k:'word-counter'},{p:'/text-stats',k:'text-stats'},
      {p:'/text-dedup',k:'text-dedup'},{p:'/text-sort',k:'text-sort'},{p:'/text-reverse',k:'text-reverse'},
      {p:'/case-converter',k:'case-converter'},{p:'/text-replace',k:'text-replace'},
      {p:'/notepad',k:'notepad'},{p:'/text-ascii',k:'text-ascii'},
      {p:'/text-diff',k:'text-diff'},{p:'/text-compare',k:'text-compare'},
      {p:'/text-to-slug',k:'text-to-slug'},{p:'/text-handwriting',k:'text-handwriting'},
      {p:'/md-table',k:'md-table'},{p:'/text-cipher',k:'text-cipher'},
    ]
  },
  {
    key: 'dev', icon: '💻', labelKey: 'cat-dev',
    tools: [
      {p:'/base64',k:'base64'},{p:'/url-encoder',k:'url-encoder'},{p:'/html-escape',k:'html-escape'},
      {p:'/hash-generator',k:'hash-generator'},{p:'/json-to-csv',k:'json-to-csv'},
      {p:'/jwt-decoder',k:'jwt-decoder'},{p:'/xml-formatter',k:'xml-formatter'},
      {p:'/json-tree',k:'json-tree'},{p:'/table-generator',k:'table-generator'},
      {p:'/code-formatter',k:'code-formatter'},
      {p:'/json-schema-gen',k:'json-schema-gen'},{p:'/json-excel',k:'json-excel'},
      {p:'/jsonp-generator',k:'jsonp-generator'},
      {p:'/api-tester',k:'api-tester'},{p:'/prompt-library',k:'prompt-library'},
      {p:'/json-to-ts',k:'json-to-ts'},{p:'/json-to-sql',k:'json-to-sql'},{p:'/csv-to-json',k:'csv-to-json'},
    ]
  },
  {
    key: 'frontend', icon: '🎨', labelKey: 'cat-frontend',
    tools: [
      {p:'/css-minify',k:'css-minify'},{p:'/js-minify',k:'js-minify'},{p:'/html-formatter',k:'html-formatter'},
      {p:'/css-animation',k:'css-anim'},{p:'/css-grid',k:'css-grid'},{p:'/css-unit',k:'css-unit'},
      {p:'/html-preview',k:'html-preview'},{p:'/svg-editor',k:'svg-editor'},
      {p:'/css-to-tailwind',k:'css-to-tailwind'},
    ]
  },
  {
    key: 'regex', icon: '🔍', labelKey: 'cat-regex',
    tools: [
      {p:'/regex-tester',k:'regex-tester'},{p:'/regex-cheatsheet',k:'regex-cheatsheet'},
      {p:'/regex-lib',k:'regex-lib'},{p:'/regex-visual',k:'regex-visual'},{p:'/regex-builder',k:'regex-builder'},
      {p:'/regex-explainer',k:'regex-explainer'},{p:'/regex-highlight',k:'regex-highlight'},
    ]
  },
  {
    key: 'crypto', icon: '🔒', labelKey: 'cat-crypto',
    tools: [
      {p:'/aes-encrypt',k:'aes-encrypt'},{p:'/rsa-generator',k:'rsa-generator'},
      {p:'/password-generator',k:'password-generator'},{p:'/password-strength',k:'password-strength'},
      {p:'/password-batch',k:'batch-pwd'},{p:'/password-vault',k:'password-vault'},
    ]
  },
  {
    key: 'gen', icon: '🎲', labelKey: 'cat-gen',
    tools: [
      {p:'/qr-code',k:'qrcode'},{p:'/qr-beautify',k:'qr-beautify'},{p:'/barcode',k:'barcode'},
      {p:'/uuid-generator',k:'uuid-generator'},
      {p:'/random-number',k:'random-number'},{p:'/cron-generator',k:'cron-generator'},
      {p:'/lorem-ipsum',k:'lorem-ipsum'},{p:'/lorem-image',k:'lorem-image'},
      {p:'/gradient-generator',k:'gradient-generator'},
      {p:'/favicon-gen',k:'favicon-gen'},
      {p:'/emoji-picker',k:'emoji-picker'},
    ]
  },
  {
    key: 'convert', icon: '🔄', labelKey: 'cat-convert',
    tools: [
      {p:'/timestamp',k:'timestamp'},{p:'/timestamp-enhanced',k:'timestamp-enhanced'},
      {p:'/number-base',k:'number-base'},
      {p:'/morse-code',k:'morse-code'},{p:'/unit-converter',k:'unit-converter'},
      {p:'/rmb-uppercase',k:'rmb-uppercase'},{p:'/number-chinese',k:'number-chinese'},
      {p:'/translator',k:'translator'},{p:'/image-format',k:'image-format'},
      {p:'/image-to-svg',k:'image-to-svg'},{p:'/svg-export',k:'svg-export'},
    ]
  },
  {
    key: 'color', icon: '🌈', labelKey: 'cat-color',
    tools: [
      {p:'/color-converter',k:'color-converter'},{p:'/color-palette',k:'color-palette'},
      {p:'/hex-rgb',k:'hex-rgb'},{p:'/color-extract',k:'color-extract'},
      {p:'/color-blind',k:'color-blind'},{p:'/color-contrast',k:'color-contrast'},
      {p:'/color-picker',k:'color-picker'},{p:'/color-mixer',k:'color-mixer'},
      {p:'/color-harmony',k:'color-harmony'},
    ]
  },
  {
    key: 'util', icon: '🧰', labelKey: 'cat-util',
    tools: [
      {p:'/image-compress',k:'image-compress'},{p:'/image-base64',k:'image-base64'},
      {p:'/image-info',k:'image-info'},{p:'/qr-scanner',k:'qr-scanner'},
      {p:'/char-info',k:'char-info'},{p:'/device-info',k:'device-info'},
      {p:'/clipboard',k:'clipboard'},{p:'/speed-test',k:'speed-test'},
      {p:'/image-editor',k:'image-editor'},{p:'/image-crop',k:'image-crop'},
      {p:'/meta-tag-gen',k:'meta-tag-gen'},{p:'/text-to-speech',k:'text-to-speech'},
      {p:'/user-agent',k:'user-agent'},{p:'/url-parser',k:'url-parser'},
      {p:'/sql-formatter',k:'sql-formatter'},
    ]
  },
  {
    key: 'time', icon: '⏰', labelKey: 'cat-time',
    tools: [
      {p:'/countdown',k:'countdown'},{p:'/stopwatch',k:'stopwatch'},
      {p:'/pomodoro',k:'pomodoro'},{p:'/date-calc',k:'date-calc'},
    ]
  },
]
