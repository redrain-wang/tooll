from flask import Flask, request, jsonify
from googletrans import Translator
import logging

app = Flask(__name__)
translator = Translator()
logging.basicConfig(level=logging.INFO)

# Normalize language codes
LANG_MAP = {
    'zh': 'zh-cn',
    'zh-cn': 'zh-cn',
    'zh-tw': 'zh-tw',
    'en': 'en',
    'en-us': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'ru': 'ru',
    'it': 'it',
    'pt': 'pt',
    'ar': 'ar',
    'th': 'th',
    'vi': 'vi',
    'id': 'id',
    'auto': 'auto',
}

@app.route('/api/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        q = data.get('q')
        source = data.get('source', 'auto')
        target = data.get('target', 'en')
        
        if not q:
            return jsonify({'error': 'Missing q'}), 400
        
        # Normalize language codes
        source = LANG_MAP.get(source.lower(), source.lower())
        target = LANG_MAP.get(target.lower(), target.lower())
        
        # googletrans doesn't support 'auto' as src, use None instead
        src_lang = None if source == 'auto' else source
        
        result = translator.translate(q, src=src_lang, dest=target)
        return jsonify({'translatedText': result.text})
    except Exception as e:
        logging.error(f'Translation error: {e}')
        return jsonify({'error': 'Translation failed'}), 500

@app.route('/health')
def health():
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)