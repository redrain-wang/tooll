const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Translation proxy - MyMemory API with quality filter
app.post('/api/translate', async (req, res) => {
  try {
    const { q, source, target } = req.body
    if (!q || !source || !target) {
      return res.status(400).json({ error: 'Missing q, source, or target' })
    }
    
    const params = new URLSearchParams({
      q: q,
      langpair: `${source}|${target}`
    })
    
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, {
      timeout: 10000
    })
    const data = await response.json()
    
    // Filter: use highest quality match that's not garbage
    let translatedText = ''
    if (data.matches && data.matches.length > 0) {
      // Sort by quality descending, filter out garbage
      const goodMatches = data.matches
        .filter(m => m.quality >= 70 && !m.translation.includes('123123') && !m.translation.includes('Minnesota') && m.translation.length > 0)
        .sort((a, b) => b.quality - a.quality)
      
      if (goodMatches.length > 0) {
        translatedText = goodMatches[0].translation
      } else if (data.responseData && data.responseData.translatedText) {
        translatedText = data.responseData.translatedText
      }
    } else if (data.responseData && data.responseData.translatedText) {
      translatedText = data.responseData.translatedText
    }
    
    if (translatedText) {
      res.json({ translatedText })
    } else {
      res.status(500).json({ error: 'No valid translation found' })
    }
  } catch (err) {
    console.error('Translation error:', err.message)
    res.status(500).json({ error: 'Translation failed' })
  }
})

app.get('/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => console.log(`Translation server running on port ${PORT}`))