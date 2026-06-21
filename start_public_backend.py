import os
import sys
from threading import Thread

try:
    from pyngrok import ngrok, conf
except ImportError:
    print('pyngrok is not installed. Run: python -m pip install pyngrok')
    sys.exit(1)

from backend import app, BACKEND_PORT


def run_backend():
    app.run(host='0.0.0.0', port=BACKEND_PORT, debug=False, use_reloader=False)


def get_auth_token():
    token = os.environ.get('NGROK_AUTH_TOKEN') or os.environ.get('NGROK_AUTHTOKEN')
    if token:
        return token
    if len(sys.argv) > 1:
        return sys.argv[1]
    return None


if __name__ == '__main__':
    auth_token = get_auth_token()
    if not auth_token:
        print('ERROR: ngrok auth token is required.')
        print('Set NGROK_AUTH_TOKEN in your environment, or run:')
        print('    python start_public_backend.py <your-ngrok-auth-token>')
        sys.exit(1)

    conf.get_default().auth_token = auth_token
    conf.get_default().region = 'us'

    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()

    try:
        public_url = ngrok.connect(BACKEND_PORT, bind_tls=True).public_url
        print('Public backend URL:', public_url)
        print('Use this URL in script.js as backendConfig.url')
        print('Press Ctrl+C to stop the backend and tunnel.')
        backend_thread.join()
    except KeyboardInterrupt:
        print('\nStopping public backend.')
        ngrok.disconnect(public_url)
        ngrok.kill()
        sys.exit(0)
