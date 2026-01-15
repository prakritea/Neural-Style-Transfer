import io
from PIL import Image

def apply_style_transfer(content_image_bytes, style_image_bytes):
    """
    Simulates style transfer by blending the content and style images.
    In a real-world scenario, this would involve a neural network.
    """
    content_image = Image.open(io.BytesIO(content_image_bytes)).convert("RGB")
    style_image = Image.open(io.BytesIO(style_image_bytes)).convert("RGB")

    # Resize style image to match content image size
    style_image = style_image.resize(content_image.size)

    # Blend the images (simulation of style transfer)
    # Using a 70% content, 30% style blend as a simple demonstration
    output_image = Image.blend(content_image, style_image, alpha=0.3)

    # Save the result to a byte buffer
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return img_byte_arr.getvalue()
