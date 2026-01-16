import io
import time
import numpy as np
import cv2
from PIL import Image

def apply_style_transfer(content_image_bytes, style_image_bytes):
    """
    Advanced 'Alchemist' Engine (Discovery v2):
    Lightweight but deep artistic texture injection.
    Separates luminance and chroma to inject artistic patterns 
    while preserving image structure.
    """
    start_time = time.time()
    print("Executing Texture-Injection Alchemist Engine...")

    # Load images using PIL
    content_pil = Image.open(io.BytesIO(content_image_bytes)).convert("RGB")
    style_pil = Image.open(io.BytesIO(style_image_bytes)).convert("RGB")

    # Resize content to a max of 1024px for processing
    max_dim = 1024
    w, h = content_pil.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        content_pil = content_pil.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    
    # Resize style to match or be slightly smaller for texture extraction
    style_pil = style_pil.resize((512, 512), Image.LANCZOS)
    
    # Convert to OpenCV BGR
    content_cv = cv2.cvtColor(np.array(content_pil), cv2.COLOR_RGB2BGR)
    style_cv = cv2.cvtColor(np.array(style_pil), cv2.COLOR_RGB2BGR)

    # --- Step 1: Color Transfer (LAB Space) ---
    # Working in LAB space prevents color bleeding and preserves lighting
    content_lab = cv2.cvtColor(content_cv, cv2.COLOR_BGR2LAB).astype(np.float32)
    style_lab = cv2.cvtColor(style_cv, cv2.COLOR_BGR2LAB).astype(np.float32)

    l_c, a_c, b_c = cv2.split(content_lab)
    l_s, a_s, b_s = cv2.split(style_lab)

    # Mean and Std for color channels
    def transfer_channel(src, tar):
        s_mean, s_std = cv2.meanStdDev(src)
        t_mean, t_std = cv2.meanStdDev(tar)
        return ((tar - t_mean.flatten()) * (s_std.flatten() / (t_std.flatten() + 1e-5))) + s_mean.flatten()

    a_new = transfer_channel(a_s, a_c)
    b_new = transfer_channel(b_s, b_c)

    # --- Step 2: Texture Extraction & Injection ---
    # Extract high-frequency "brush strokes" from style luminance
    l_s_blur = cv2.GaussianBlur(l_s, (21, 21), 0)
    texture_mask = l_s - l_s_blur # High frequency component
    
    # Apply a painterly smoothing to content luminance
    l_c_painterly = cv2.bilateralFilter(l_c, d=9, sigmaColor=75, sigmaSpace=75)
    
    # Resize texture mask to match content
    texture_mask_resized = cv2.resize(texture_mask, (l_c.shape[1], l_c.shape[0]))
    
    # Inject texture into the content's luminance
    # We use a weight (e.g. 0.4) to not overwhelm the image
    l_final = l_c_painterly + (texture_mask_resized * 0.45)
    l_final = np.clip(l_final, 0, 100) # L channel is 0-100 in LAB

    # Merge logic fix: Ensure all channels are exact same shape and type
    a_new = a_new.astype(np.float32)
    b_new = b_new.astype(np.float32)
    l_final = l_final.astype(np.float32)

    # Combine back
    merged_lab = cv2.merge([l_final, a_new, b_new])
    merged_lab = np.clip(merged_lab, 0, 255).astype(np.uint8)
    stylized_cv = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)

    # --- Step 3: Final Artist Polish ---
    # Add a subtle 'edge enhancement' to make it feel more like a sketch/painting
    gray = cv2.cvtColor(content_cv, cv2.COLOR_BGR2GRAY)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 9, 2)
    edges_colored = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    
    # Soft blend with stylized result
    final_cv = cv2.addWeighted(stylized_cv, 0.92, edges_colored, 0.08, 0)

    # --- Step 4: Premium 4K Export ---
    output_pil = Image.fromarray(cv2.cvtColor(final_cv, cv2.COLOR_BGR2RGB))
    target_upscale = 4096
    w, h = output_pil.size
    scale = target_upscale / max(w, h)
    final_output = output_pil.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    print(f"Texture-Injection complete in {time.time() - start_time:.2f}s")
    
    # Save to buffer
    img_byte_arr = io.BytesIO()
    final_output.save(img_byte_arr, format='PNG', quality=90)
    img_byte_arr.seek(0)
    
    return img_byte_arr.getvalue()

def load_models():
    """Dummy function for backward compatibility."""
    print("Texture-Injection Alchemist Engine active.")
    pass
