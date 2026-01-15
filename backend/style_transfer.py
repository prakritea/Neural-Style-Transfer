import io
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from PIL import Image

# Load the model at module level to avoid reloading on every request.
# This might take a few seconds on first import.
# Using the model URL provided by the user.
hub_module = hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2')

def apply_style_transfer(content_image_bytes, style_image_bytes):
    """
    Applies Neural Style Transfer using the Magenta model from TensorFlow Hub.
    """
    # Load and convert images to RGB
    content_img = Image.open(io.BytesIO(content_image_bytes)).convert("RGB")
    style_img = Image.open(io.BytesIO(style_image_bytes)).convert("RGB")

    # Format images for the model (Add batch dimension and normalize to [0, 1])
    content_image = np.array(content_img).astype(np.float32)[np.newaxis, ...] / 255.0
    style_image = np.array(style_img).astype(np.float32)[np.newaxis, ...] / 255.0

    # Resize style image as recommended by the model documentation (256x256)
    style_image = tf.image.resize(style_image, (256, 256))

    # Apply the stylization model
    # hub_module takes (content_image, style_image) as input
    outputs = hub_module(tf.constant(content_image), tf.constant(style_image))
    stylized_image = outputs[0]

    # Convert the resulting tensor back to a PIL Image
    # Output values are in [0, 1], so we scale to [0, 255]
    stylized_image_np = np.array(stylized_image[0] * 255).astype(np.uint8)
    output_image = Image.fromarray(stylized_image_np)

    # Save the result to a byte buffer for the response
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return img_byte_arr.getvalue()
