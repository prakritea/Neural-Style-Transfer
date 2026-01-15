from fastapi import FastAPI, UploadFile, File, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from style_transfer import apply_style_transfer
from auth import signup_user, authenticate_user, create_access_token
import uvicorn

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAuth(BaseModel):
    username: str
    password: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/signup")
async def signup(user_data: UserAuth):
    success, message = signup_user(user_data.username, user_data.password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.post("/api/login")
async def login(user_data: UserAuth):
    user = authenticate_user(user_data.username, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "username": user["username"]}

@app.post("/api/style-transfer")
async def style_transfer(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...)
):
    # Read image bytes
    content_bytes = await content_image.read()
    style_bytes = await style_image.read()

    # Apply style transfer (simulated)
    result_bytes = apply_style_transfer(content_bytes, style_bytes)

    # Return the generated image
    return Response(content=result_bytes, media_type="image/png")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
