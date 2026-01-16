import io
import time
import numpy as np
import cv2
from PIL import Image

def apply_style_transfer(content_image_bytes, style_image_bytes):
    """
    Lightweight 'Alchemist' Engine:
    Efficient artistic stylization using OpenCV and NumPy.
    Designed to run on < 512MB RAM (Free Tier).
    """
    start_time = time.time()
    print("Executing Lightweight Alchemist Engine...")

    # Load images using PIL
    content_pil = Image.open(io.BytesIO(content_image_bytes)).convert("RGB")
    style_pil = Image.open(io.BytesIO(style_image_bytes)).convert("RGB")

    # Resize content to a max of 1024px for processing while keeping aspect ratio
    max_dim = 1024
    w, h = content_pil.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        content_pil = content_pil.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    
    # Convert to OpenCV BGR format
    content_cv = cv2.cvtColor(np.array(content_pil), cv2.COLOR_RGB2BGR)
    style_cv = cv2.cvtColor(np.array(style_pil), cv2.COLOR_RGB2BGR)

    # 1. Color Transfer: Map style colors to content
    # We use a simple mean/std dev shift for efficiency
    content_mean, content_std = cv2.meanStdDev(content_cv)
    style_mean, style_std = cv2.meanStdDev(style_cv)
    
    content_cv = content_cv.astype(np.float32)
    style_transfer = ((content_cv - content_mean.flatten()) * (style_std.flatten() / (content_std.flatten() + 1e-5))) + style_mean.flatten()
    style_transfer = np.clip(style_transfer, 0, 255).astype(np.uint8)

    # 2. Painterly Effect (Edge Preserving Smoothing)
    # Using bilateral filter for a smooth, artistic look
    stylized = cv2.bilateralFilter(style_transfer, d=9, sigmaColor=75, sigmaSpace=75)
    
    # 3. Enhance Edges (Pencil/Sketch feel)
    gray = cv2.cvtColor(content_cv.astype(np.uint8), cv2.COLOR_BGR2GRAY)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 9, 2)
    edges_colored = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    
    # Blend stylization with edges
    final_cv = cv2.addWeighted(stylized, 0.9, edges_colored, 0.1, 0)

    # 4. Premium 4K Upscale (Lanczos)
    output_pil = Image.fromarray(cv2.cvtColor(final_cv, cv2.COLOR_BGR2RGB))
    # True 4K resize (4096px width or height)
    target_upscale = 4096
    w, h = output_pil.size
    if w > h:
        new_size = (target_upscale, int(h * (target_upscale / w)))
    else:
        new_size = (int(w * (target_upscale / h)), target_upscale)
    
    final_output = output_pil.resize(new_size, Image.LANCZOS)

    print(f"Alchemist process complete in {time.time() - start_time:.2f}s")
    
    # Save to buffer
    img_byte_arr = io.BytesIO()
    final_output.save(img_byte_arr, format='PNG', quality=85)
    img_byte_arr.seek(0)
    
    return img_byte_arr.getvalue()

def load_models():
    """Dummy function for backward compatibility."""
    print("Alchemist Engine active (No model loading required).")
    pass
