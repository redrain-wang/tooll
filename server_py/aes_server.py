from flask import Flask, request, jsonify
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64
import os

app = Flask(__name__)


def _get_key(key_str: str) -> bytes:
    if not key_str:
        raise ValueError('密钥不能为空')
    encoded = key_str.encode('utf-8')
    if len(encoded) < 32:
        encoded = encoded + b'0' * (32 - len(encoded))
    return encoded[:32]


@app.route('/api/aes/encrypt', methods=['POST'])
def encrypt():
    try:
        data = request.get_json(force=True)
        text = data.get('text', '')
        key_str = data.get('key', '')
        key = _get_key(key_str)
        aesgcm = AESGCM(key)
        iv = os.urandom(12)
        plaintext = text.encode('utf-8')
        ciphertext = aesgcm.encrypt(iv, plaintext, None)
        result = base64.b64encode(iv + ciphertext).decode('ascii')
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/aes/decrypt', methods=['POST'])
def decrypt():
    try:
        data = request.get_json(force=True)
        text = data.get('text', '')
        key_str = data.get('key', '')
        key = _get_key(key_str)
        aesgcm = AESGCM(key)
        raw = base64.b64decode(text)
        iv = raw[:12]
        ciphertext = raw[12:]
        plaintext = aesgcm.decrypt(iv, ciphertext, None)
        return jsonify({'success': True, 'result': plaintext.decode('utf-8')})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003)
