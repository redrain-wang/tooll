from flask import Flask, request, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import logging
import hashlib

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/api/rsa/generate', methods=['POST'])
def generate_rsa():
    try:
        data = request.get_json()
        key_size = data.get('keySize', 2048)
        
        # Validate key size
        if key_size not in [1024, 2048, 4096]:
            key_size = 2048
        
        # Generate RSA key pair
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=key_size
        )
        
        # Serialize private key (PKCS8)
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')
        
        # Serialize public key (SPKI)
        public_key = private_key.public_key()
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        
        return jsonify({
            'public': public_pem,
            'private': private_pem
        })
    except Exception as e:
        logging.error(f'RSA generation error: {e}')
        return jsonify({'error': 'Generation failed'}), 500

@app.route('/api/hash', methods=['POST'])
def hash_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        b = text.encode('utf-8')
        return jsonify({
            'success': True,
            'sha256': hashlib.sha256(b).hexdigest(),
            'sha384': hashlib.sha384(b).hexdigest(),
            'sha512': hashlib.sha512(b).hexdigest()
        })
    except Exception as e:
        logging.error(f'Hash error: {e}')
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'ok': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)