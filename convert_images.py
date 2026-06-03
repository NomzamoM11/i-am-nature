import os
from PIL import Image

def optimize_images():
    image_dir = 'images'
    if not os.path.exists(image_dir):
        print(f"Error: '{image_dir}' folder not found. Are you in the right directory?")
        return

    print("--- Starting I AM NATURE Image Optimization ---")
    
    # Specific dimensions gathered from your Lighthouse report
    resize_targets = {
        'fenugreek.jpg': (547, 438),
        'moringa.jpg': (568, 438)
    }

    total_old_size = 0
    total_new_size = 0

    # Scan through the images directory
    for filename in os.listdir(image_dir):
        file_path = os.path.join(image_dir, filename)
        
        # Skip if it's not an image file or if it's already a webp
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')) or filename.lower().endswith('.webp'):
            continue
            
        try:
            old_size = os.path.getsize(file_path)
            total_old_size += old_size
            
            with Image.open(file_path) as img:
                # 1. Handle explicit resizing for oversized Lighthouse culprits
                if filename in resize_targets:
                    target_width, target_height = resize_targets[filename]
                    img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                    print(f" Resized {filename} to {target_width}x{target_height}")
                
                # 2. Determine new WebP filename
                base_name = os.path.splitext(filename)[0]
                webp_filename = f"{base_name}.webp"
                webp_path = os.path.join(image_dir, webp_filename)
                
                # 3. Convert and save as modern compressed WebP format
                # Using a quality factor of 80 offers an incredible visual-to-compression ratio
                img.save(webp_path, 'WEBP', quality=80)
                
                new_size = os.path.getsize(webp_path)
                total_new_size += new_size
                
                saved_kb = (old_size - new_size) / 1024
                print(f" Converted: {filename} -> {webp_filename} (Saved {saved_kb:.1f} KB)")
                
        except Exception as e:
            print(f" Couldn't process {filename}: {e}")

    # Calculate total performance impact
    if total_old_size > 0:
        savings_mb = (total_old_size - total_new_size) / (1024 * 1024)
        print("\n--- OPTIMIZATION COMPLETE ---")
        print(f"Total estimated space saved: {savings_mb:.2f} MB")
        print("Next step: Update your HTML files to point to the new .webp images!")
    else:
        print("\nNo original images found to convert.")

if __name__ == '__main__':
    optimize_images()