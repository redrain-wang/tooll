const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single'

app.post('/api/translate', async (req, res) => {
  try {
    const { q, source, target } = req.body
    if (!q || !source || !target) {
      return res.status(400).json({ error: 'Missing q, source, or target' })
    }
    
    const response = await axios.get(GOOGLE_TRANSLATE_URL, {
      params: {
        client: 'gtx',
        sl: source,
        tl: target,
        dt: 't',
        q: q
      },
      timeout: 10000
    })
    
    // Google returns: [[["translated", "original", ...]], ...]
    const translated = response.data[0]?.[0]?.[0] || ''
    res.json({ translatedText: translated })
  } catch (error) {
    console.error('Translation error:', error.message)
    res.status(500).json({ error: 'Translation failed' })
  }
})

app.get('/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => console.log(`Translation server running on port ${PORT}`))
