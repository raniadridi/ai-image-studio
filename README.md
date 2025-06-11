A modern Flask web application that generates images using Stable Diffusion AI model via Hugging Face API.

## Features

- **AI Image Generation**: Generate high-quality images from text prompts
- **Modern UI**: Responsive design with Bootstrap and custom styling
- **Image Gallery**: View and download previously generated images
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Visual feedback during image generation
- **Download Support**: Download generated images directly
- **Mobile Friendly**: Fully responsive design

## Project Structure

```
flask-image-generator/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── static/              # Static files (CSS, JS, images)
├── templates/           # HTML templates
├── utils/               # Utility functions
└── README.md           # This file
```

## Installation

1. **Clone or create the project directory:**
   ```bash
   mkdir flask-image-generator
   cd flask-image-generator
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the project root
   - Add your Hugging Face API token:
     ```
     SECRET_KEY=your-super-secret-key-here
     HUGGINGFACE_API_TOKEN=your-huggingface-token-here
     ```

5. **Create necessary directories:**
   ```bash
   mkdir -p static/images/generated
   mkdir -p static/css
   mkdir -p static/js
   mkdir -p utils
   ```

## Usage

1. **Run the application:**
   ```bash
   python app.py
   ```

2. **Open your browser and go to:** `http://localhost:5000`

3. **Generate images:**
   - Enter a descriptive prompt
   - Click "Generate Image"
   - Wait for the AI to create your image
   - Download or view in gallery

## API Endpoints

- `GET /` - Main page with image generation form
- `POST /generate` - Generate image from JSON prompt
- `GET /gallery` - View gallery of generated images

## Configuration

The app uses environment variables for configuration:

- `SECRET_KEY`: Flask secret key for sessions
- `HUGGINGFACE_API_TOKEN`: Your Hugging Face API token
- `UPLOAD_FOLDER`: Directory for storing generated images (default: static/images/generated)

## Tips for Better Prompts

- **Be specific**: Include details about style, colors, mood
- **Add style keywords**: "digital art", "photorealistic", "oil painting"
- **Describe lighting**: "golden hour", "dramatic lighting"
- **Include quality terms**: "highly detailed", "4k", "masterpiece"

## Error Handling

The application includes comprehensive error handling for:
- API rate limits and timeouts
- Model loading delays
- Network connectivity issues
- Invalid prompts or responses

## Deployment

For production deployment:

1. Set `DEBUG=False` in config
2. Use a production WSGI server like Gunicorn
3. Set up proper environment variables
4. Configure reverse proxy (nginx)
5. Set up SSL certificates

## Dependencies

- Flask: Web framework
- Pillow: Image processing
- Requests: HTTP requests to Hugging Face API
- python-dotenv: Environment variable management
- Werkzeug: WSGI utilities

