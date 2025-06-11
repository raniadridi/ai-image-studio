import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    HUGGINGFACE_API_TOKEN = os.environ.get('HUGGINGFACE_API_TOKEN')
    UPLOAD_FOLDER = os.path.join('static', 'images', 'generated')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///ai_image_studio.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False