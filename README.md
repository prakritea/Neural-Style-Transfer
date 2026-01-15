# Artisian Studio - Neural Style Transfer

Artisian Studio is a modern web application that allows users to perform AI-powered Neural Style Transfer on their images. Users can upload a "content" image and a "style" image to generate a unique piece of artwork.

## Features

- **Neural Style Transfer**: Blends the artistic style of one image into another.
- **User Authentication**: Secure sign-up and login system using JWT and password hashing (bcrypt).
- **Route Protection**: Browsing the application requires being logged in.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for smooth animations and a premium feel.
- **FastAPI Backend**: High-performance Python backend for image processing and user management.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Python, FastAPI, Uvicorn, Pillow (for image processing), Passlib (for auth).
- **Database**: Local JSON storage (for users).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- pip (Python package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prakritea/Neural-Style-Transfer.git
   cd Neural-Style-Transfer
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Backend**:
   From the `backend` directory:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`.

2. **Start the Frontend**:
   From the project root:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8080`.

## How to use

1. Open the website and create an account via the **Sign Up** page.
2. **Log In** with your credentials.
3. Upload a **Content Image** (the image you want to change).
4. Upload a **Style Image** (the artistic style you want to apply).
5. Click **Generate Artwork** to see the result!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
