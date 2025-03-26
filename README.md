Neural Style Transfer (NST) is a computer vision technique that takes two images — a content image (what you want to transform) and a style image (the artistic style you want to apply) — and combines them to create a new image that looks like the content image, but painted in the style of the second image.

For example, you could take a photo of your face and apply Van Gogh’s Starry Night style to make it look like a painting.

🎯 How it Works (Simplified)
Feature Extraction: A pre-trained CNN (like VGG19) extracts features from both the content and style images.

Early layers capture low-level features (edges, textures).

Deeper layers capture high-level content (objects, structure).

Loss Functions:

Content Loss: Ensures the output image retains the content image’s structure.

Style Loss: Captures the style image’s patterns and textures using Gram matrices (correlation between feature maps).

Total Variation Loss (optional): Helps smooth the final image.

Optimization: The output image starts as a random noise image and gets updated iteratively using gradient descent to minimize the combined loss (content + style).
