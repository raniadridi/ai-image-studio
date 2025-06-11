from flask import Flask, request, render_template, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from PIL import Image
from io import BytesIO
import requests
import base64
import time
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_image_studio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
API_TOKEN = os.getenv('HUGGINGFACE_API_TOKEN')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    images = db.relationship('GeneratedImage', backref='user', lazy=True)

class GeneratedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.Text, nullable=False)
    image_data = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_guest = db.Column(db.Boolean, default=False)

    def get_url(self):
        return f"data:image/png;base64,{self.image_data}"

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Create Account')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already taken.')

def generate_image(prompt):
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    payload = {"inputs": prompt}
    
    for attempt in range(3):
        try:
            print(f"Attempt {attempt + 1}: Generating image for '{prompt}'")
            
            timeout = 30 if attempt == 0 else 60
            response = requests.post(API_URL, headers=headers, json=payload, timeout=timeout)
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                image = Image.open(BytesIO(response.content))
                print("Success!")
                return image
            elif response.status_code == 503:
                print("Model loading, waiting...")
                time.sleep(20)
                continue
            else:
                print(f"Error: {response.text}")
                break
                
        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt + 1}")
            if attempt < 2:
                time.sleep(5)
                continue
            else:
                return None
        except Exception as e:
            print(f"Error: {e}")
            break
    
    return None

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            password_hash=generate_password_hash(form.password.data)
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        flash('Account created successfully!', 'success')
        return redirect(url_for('index'))
    
    return render_template('auth/register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user)
            flash('Welcome back!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials.', 'error')
    
    return render_template('auth/login.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    user_images = GeneratedImage.query.filter_by(user_id=current_user.id).order_by(GeneratedImage.created_at.desc()).all()
    recent_count = GeneratedImage.query.filter_by(user_id=current_user.id).filter(
        GeneratedImage.created_at >= datetime.utcnow().replace(day=1)
    ).count()
    return render_template('dashboard.html', user_images=user_images, recent_count=recent_count)

@app.route('/create')
@login_required
def create():
    # Just redirect to main page since that's where image creation happens
    return redirect(url_for('index'))

@app.route('/guest-create')
def guest_create():
    # Just redirect to main page for guest creation
    return redirect(url_for('index'))

@app.route('/gallery')
def gallery():
    images = GeneratedImage.query.order_by(GeneratedImage.created_at.desc()).limit(20).all()
    return render_template('gallery.html', images=images)

@app.route('/delete_image/<int:image_id>', methods=['POST'])
@login_required
def delete_image(image_id):
    image = GeneratedImage.query.get_or_404(image_id)
    if image.user_id != current_user.id:
        return jsonify({'success': False, 'error': 'Unauthorized'})
    
    db.session.delete(image)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        prompt = request.form['prompt']
        
        try:
            image = generate_image(prompt)
            
            if image:
                buffer = BytesIO()
                image.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
                
                # Save to database
                if current_user.is_authenticated:
                    new_image = GeneratedImage(
                        prompt=prompt,
                        image_data=img_str,
                        user_id=current_user.id,
                        is_guest=False
                    )
                else:
                    new_image = GeneratedImage(
                        prompt=prompt,
                        image_data=img_str,
                        user_id=None,
                        is_guest=True
                    )
                
                db.session.add(new_image)
                db.session.commit()
                
                return render_template('index.html', img_data=img_str, prompt=prompt)
            else:
                return render_template('index.html', 
                    error="Failed to generate image. The AI model might be busy. Please try again in a few minutes.", 
                    prompt=prompt)
                    
        except Exception as e:
            print(f"Exception in route: {e}")
            return render_template('index.html', 
                error="Something went wrong. Please try again later.", 
                prompt=prompt)
    
    return render_template('index.html')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)