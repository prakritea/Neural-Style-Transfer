from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import uvicorn
import base64


app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
hub_model = hub.load("https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2")

def load_image(file: UploadFile, resize=None):
    image = Image.open(io.BytesIO(file.file.read())).convert("RGB")
    if resize:
        image = image.resize(resize)
    image = np.array(image).astype(np.float32)[np.newaxis, ...] / 255.0
    return tf.constant(image)

@app.get("/")
def root():
    return {"message": "Server is running"}


@app.post("/stylize")
async def stylize_image(content: UploadFile = File(...), style: UploadFile = File(...)):
    content_image = load_image(content)
    style_image = load_image(style, resize=(256, 256))

    outputs = hub_model(content_image, style_image)
    stylized_image = outputs[0][0].numpy()

    # Convert image to bytes
    stylized_image = (stylized_image * 255).astype(np.uint8)
    pil_img = Image.fromarray(stylized_image)
    buf = io.BytesIO()
    pil_img.save(buf, format='JPEG')
    buf.seek(0)

    return {
        "image": "data:image/jpeg;base64," + base64.b64encode(buf.read()).decode("utf-8")
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
