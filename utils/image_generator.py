import requests
from PIL import Image
from io import BytesIO
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImageGenerator:
    def __init__(self, api_token):
        self.api_token = api_token
        self.api_url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        self.headers = {"Authorization": f"Bearer {api_token}"}
    
    def generate_image(self, prompt, max_retries=3):
        payload = {"inputs": prompt}
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Generating image for prompt: '{prompt}' (Attempt {attempt + 1})")
                
                response = requests.post(
                    self.api_url, 
                    headers=self.headers, 
                    json=payload,
                    timeout=60
                )
                
                logger.info(f"API Response Status: {response.status_code}")
                
                if response.status_code == 200:
                    try:
                        image = Image.open(BytesIO(response.content))
                        logger.info("Image generated successfully")
                        return {
                            'success': True,
                            'image': image,
                            'prompt': prompt
                        }
                    except Exception as e:
                        logger.error(f"Error processing image: {str(e)}")
                        return {
                            'success': False,
                            'error': f'Error processing generated image: {str(e)}'
                        }
                
                elif response.status_code == 503:
                    logger.warning("Model is loading, waiting 20 seconds...")
                    if attempt < max_retries - 1:
                        time.sleep(20)
                        continue
                    else:
                        return {
                            'success': False,
                            'error': 'Model is still loading. Please try again later.'
                        }
                
                elif response.status_code == 429:
                    logger.warning("Rate limited, waiting 10 seconds...")
                    if attempt < max_retries - 1:
                        time.sleep(10)
                        continue
                    else:
                        return {
                            'success': False,
                            'error': 'Rate limit exceeded. Please try again later.'
                        }
                
                elif response.status_code == 401:
                    return {
                        'success': False,
                        'error': 'Invalid API token. Please check your Hugging Face API token in .env file.'
                    }
                
                elif response.status_code == 404:
                    return {
                        'success': False,
                        'error': 'Model not found. The SDXL model might not be available via free API.'
                    }
                
                else:
                    error_msg = f"API Error {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    return {
                        'success': False,
                        'error': error_msg
                    }
                    
            except requests.exceptions.Timeout:
                logger.error("Request timed out")
                if attempt < max_retries - 1:
                    time.sleep(5)
                    continue
                else:
                    return {
                        'success': False,
                        'error': 'Request timed out. Please try again.'
                    }
            
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                return {
                    'success': False,
                    'error': f'Unexpected error: {str(e)}'
                }
        
        return {
            'success': False,
            'error': 'Failed to generate image after multiple attempts'
        }