import sys
import os
import io
import time
from PIL import Image

# Add current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from style_transfer import apply_style_transfer

def test_performance_optimization():
    print("Testing Performance Optimization (Capping & Timing)...")
    
    # Create a 2K image to test capping logic (2048x2048)
    large_img = Image.new('RGB', (2048, 2048), color=(255, 100, 100))
    style_img = Image.new('RGB', (256, 256), color=(100, 100, 255))
    
    content_bytes = io.BytesIO()
    large_img.save(content_bytes, format='JPEG') # JPEG is faster to save/load
    
    style_bytes = io.BytesIO()
    style_img.save(style_bytes, format='JPEG')
    
    print(f"Content Image Size: {large_img.size}")
    
    start_time = time.time()
    try:
        print("Executing apply_style_transfer (with 2K input, should cap to 1024px)...")
        result_bytes = apply_style_transfer(content_bytes.getvalue(), style_bytes.getvalue())
        
        result_img = Image.open(io.BytesIO(result_bytes))
        total_time = time.time() - start_time
        print(f"Success! Total Execution Time: {total_time:.2f}s")
        print(f"Output Image Size: {result_img.size}")
        
        # Output should be (1024*4, 1024*4) = (4096, 4096)
        if result_img.size == (4096, 4096):
            print("Confirmed: 2K input capped to 1024px and result is exactly 4K!")
            return True
        else:
            print(f"Warning: Output size {result_img.size} is not 4K (4096x4096)")
            return False
            
    except Exception as e:
        print(f"Performance test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if test_performance_optimization():
        print("Optimization Verification complete.")
        sys.exit(0)
    else:
        print("Optimization Verification failed.")
        sys.exit(1)
