// tests/utils.test.ts - Core utility tests
import { describe, it, expect } from 'vitest'

// Test color conversion utilities
describe('Color Conversion', () => {
  it('should convert hex to rgb', () => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }
    
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 })
    expect(hexToRgb('FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('should convert rgb to hex', () => {
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
    
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff')
  })

  it('should convert rgb to hsl', () => {
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255; g /= 255; b /= 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      let h = 0, s = 0, l = (max + min) / 2
      
      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h /= 6
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
    }
    
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 })
    expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 })
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 })
    expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 })
  })
})

// Test base64 encoding/decoding
describe('Base64', () => {
  it('should encode and decode correctly', () => {
    const encode = (str: string) => btoa(unescape(encodeURIComponent(str)))
    const decode = (str: string) => decodeURIComponent(escape(atob(str)))
    
    const testStr = 'Hello World! 中文测试'
    const encoded = encode(testStr)
    const decoded = decode(encoded)
    
    expect(decoded).toBe(testStr)
  })

  it('should handle empty string', () => {
    expect(btoa('')).toBe('')
    expect(atob('')).toBe('')
  })

  it('should handle special characters', () => {
    const str = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const encoded = btoa(unescape(encodeURIComponent(str)))
    const decoded = decodeURIComponent(escape(atob(encoded)))
    expect(decoded).toBe(str)
  })
})

// Test URL encoding/decoding
describe('URL Encoding', () => {
  it('should encode and decode URLs', () => {
    const testUrl = 'https://example.com/path?name=张三&age=25'
    const encoded = encodeURIComponent(testUrl)
    const decoded = decodeURIComponent(encoded)
    expect(decoded).toBe(testUrl)
  })

  it('should handle spaces', () => {
    expect(encodeURIComponent('hello world')).toBe('hello%20world')
    expect(decodeURIComponent('hello%20world')).toBe('hello world')
  })
})

// Test timestamp conversion
describe('Timestamp', () => {
  it('should convert date to timestamp', () => {
    const date = new Date('2024-01-01T00:00:00Z')
    const timestamp = Math.floor(date.getTime() / 1000)
    expect(timestamp).toBe(1704067200)
  })

  it('should convert timestamp to date', () => {
    const timestamp = 1704067200
    const date = new Date(timestamp * 1000)
    expect(date.toISOString().startsWith('2024-01-01')).toBe(true)
  })
})

// Test number base conversion
describe('Base Conversion', () => {
  it('should convert decimal to binary', () => {
    expect((42).toString(2)).toBe('101010')
    expect((255).toString(2)).toBe('11111111')
  })

  it('should convert decimal to hex', () => {
    expect((42).toString(16)).toBe('2a')
    expect((255).toString(16)).toBe('ff')
  })

  it('should convert between bases', () => {
    const parse = (str: string, base: number) => parseInt(str, base)
    const toBase = (num: number, base: number) => num.toString(base)
    
    expect(parse('101010', 2)).toBe(42)
    expect(toBase(42, 16)).toBe('2a')
    expect(toBase(parse('ff', 16), 2)).toBe('11111111')
  })
})

// Test JSON utilities
describe('JSON Utils', () => {
  it('should format JSON', () => {
    const obj = { a: 1, b: { c: 2 } }
    const formatted = JSON.stringify(obj, null, 2)
    expect(formatted).toContain('\n')
    expect(formatted).toContain('  ')
  })

  it('should minify JSON', () => {
    const obj = { a: 1, b: { c: 2 } }
    const minified = JSON.stringify(obj)
    expect(minified).not.toContain('\n')
    expect(minified).toBe('{"a":1,"b":{"c":2}}')
  })

  it('should validate JSON', () => {
    expect(() => JSON.parse('{"a":1}')).not.toThrow()
    expect(() => JSON.parse('{a:1}')).toThrow()
    expect(() => JSON.parse('{"a":}')).toThrow()
  })
})

// Test text utilities
describe('Text Utils', () => {
  it('should count words', () => {
    const countWords = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0
    expect(countWords('hello world')).toBe(2)
    expect(countWords('  hello   world  ')).toBe(2)
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })

  it('should count characters', () => {
    const countChars = (text: string) => text.length
    const countCharsNoSpace = (text: string) => text.replace(/\s/g, '').length
    
    expect(countChars('hello')).toBe(5)
    expect(countCharsNoSpace('hello world')).toBe(10)
  })

  it('should deduplicate lines', () => {
    const dedup = (text: string) => [...new Set(text.split('\n'))].join('\n')
    const input = 'a\nb\na\nc\nb'
    expect(dedup(input)).toBe('a\nb\nc')
  })

  it('should sort lines', () => {
    const sortLines = (text: string) => text.split('\n').sort().join('\n')
    expect(sortLines('c\na\nb')).toBe('a\nb\nc')
  })

  it('should reverse text', () => {
    const reverse = (text: string) => text.split('').reverse().join('')
    expect(reverse('hello')).toBe('olleh')
    expect(reverse('abc')).toBe('cba')
  })
})

// Test UUID generation
describe('UUID', () => {
  it('should generate valid UUID v4', () => {
    const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    
    const u = uuid()
    expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })
})

// Test regex utils
describe('Regex Utils', () => {
  it('should test email regex', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(emailRegex.test('test@example.com')).toBe(true)
    expect(emailRegex.test('invalid')).toBe(false)
    expect(emailRegex.test('test@')).toBe(false)
  })

  it('should test URL regex', () => {
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/
    expect(urlRegex.test('https://example.com')).toBe(true)
    expect(urlRegex.test('http://localhost:3000')).toBe(true)
    expect(urlRegex.test('invalid')).toBe(false)
  })

  it('should test phone regex (China)', () => {
    const phoneRegex = /^1[3-9]\d{9}$/
    expect(phoneRegex.test('13800138000')).toBe(true)
    expect(phoneRegex.test('12345678901')).toBe(false)
    expect(phoneRegex.test('1380013800')).toBe(false)
  })
})