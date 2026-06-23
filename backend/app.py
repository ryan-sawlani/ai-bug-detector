from flask import Flask
from flask_cors import CORS
from routes.analyze import analyze_bp
from routes.health import health_bp

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"])
    app.register_blueprint(analyze_bp)
    app.register_blueprint(health_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
