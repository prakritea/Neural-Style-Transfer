import io
import time
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from PIL import Image

# Global variables to store models for reuse across requests
STYLE_MODEL = None
SUPER_RES_MODEL = None

def load_models():
    """Lazy-load the AI models to save memory during startup."""
    global STYLE_MODEL, SUPER_RES_MODEL
    if STYLE_MODEL is None:
        start_time = time.time()
        print("Loading Magenta Style Transfer model...")
        STYLE_MODEL = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')
        print(f"Magenta model loaded in {time.time() - start_time:.2f}s")
        
    if SUPER_RES_MODEL is None:
        start_time = time.time()
        print("Loading ESRGAN Super Resolution model...")
        SUPER_RES_MODEL = hub.load('https://tfhub.dev/captain-pool/esrgan-tf2/1')
        print(f"ESRGAN model loaded in {time.time() - start_time:.2f}s")

def preprocess_image(image_bytes, target_dim=None, max_dim=None):
    """
    Loads and prepares an image for model input.
    Optionally resizes to target_dim or caps to max_dim while maintaining aspect ratio.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    if max_dim:
        # Cap resolution while maintaining aspect ratio
        w, h = img.size
        if max(w, h) > max_dim:
            if w > h:
                new_w = max_dim
                new_h = int(h * (max_dim / w))
            else:
                new_h = max_dim
                new_w = int(w * (max_dim / h))
            print(f"Capping resolution from {w}x{h} to {new_w}x{new_h}")
            img = img.resize((new_w, new_h), Image.LANCZOS)
    
    if target_dim:
        img = img.resize(target_dim, Image.LANCZOS)
        
    img_array = np.array(img).astype(np.float32)
    # Add batch dimension and normalize to [0, 1]
    return img_array[np.newaxis, ...] / 255.0

def apply_style_transfer(content_image_bytes, style_image_bytes):
    """
    Optimized Premium 4K Style Transfer Pipeline:
    1. Neural Style Transfer (Magenta) - Capped to 1024px to ensure 4K limit.
    2. Super Resolution (ESRGAN 4x Upscaling)
    """
    load_models()

    # --- Step 1: Neural Style Transfer ---
    # We cap content to 1024px. 4x upscale on 1024px = 4096px (True 4K).
    # This prevents the server from hanging on massive images like 8K+.
    content_tensor = preprocess_image(content_image_bytes, max_dim=1024)
    style_tensor = preprocess_image(style_image_bytes, target_dim=(256, 256))

    print(f"Step 1: Applying Neural Style Transfer on {content_tensor.shape[1]}x{content_tensor.shape[2]} content...")
    start_stylize = time.time()
    
    stylized_outputs = STYLE_MODEL(tf.constant(content_tensor), tf.constant(style_tensor))
    stylized_image = stylized_outputs[0] # Output is float32 [0, 1]
    
    print(f"Stylization complete in {time.time() - start_stylize:.2f}s")

    # --- Step 2: Super Resolution (ESRGAN) ---
    print("Step 2: Applying ESRGAN 4x Super Resolution...")
    start_sr = time.time()
    
    # Scale stylized image to [0, 255] for ESRGAN
    sr_input = stylized_image * 255.0
    
    # hr_output is [Batch, Height*4, Width*4, 3]
    hr_output = SUPER_RES_MODEL(sr_input)
    
    print(f"Super Resolution complete in {time.time() - start_sr:.2f}s")
    
    # --- Step 3: Post-processing ---
    hr_output = tf.clip_by_value(hr_output, 0, 255)
    hr_image_np = np.array(hr_output[0]).astype(np.uint8)
    
    output_image = Image.fromarray(hr_image_np)

    # Save to buffer
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG', quality=95)
    img_byte_arr.seek(0)
    
    return img_byte_arr.getvalue()
