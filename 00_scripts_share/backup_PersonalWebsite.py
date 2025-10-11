import os
import zipfile
from datetime import datetime
import sys
import time
from tqdm import tqdm
import re # Import the re module for regular expressions

DEFAULT_FOLDER = "/Users/username/PersonalWebsiteDemo"

def sanitize_filename_part(text):
    """
    Sanitizes a string to be suitable for a filename part.
    Replaces spaces with underscores and removes characters not allowed in filenames.
    """
    if not text:
        return ""
    # Replace spaces with underscores
    sanitized = text.replace(" ", "_")
    # Remove characters that are not alphanumeric, underscore, hyphen, or dot
    # This keeps common filename-safe characters.
    sanitized = re.sub(r'[^\w\.\-]', '', sanitized)
    # Remove leading/trailing dots, underscores, or hyphens that might result from sanitization
    sanitized = sanitized.strip('._-')
    return sanitized.lower() # Optionally convert to lowercase for consistency

def zip_folder(folder_path, message=None):
    start_time = time.time()

    folder_path = os.path.abspath(folder_path)
    folder_name = os.path.basename(folder_path.rstrip("/\\"))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # --- NEW CODE START ---
    # Sanitize the message if it exists and prepare it for the filename
    message_part_for_filename = ""
    if message:
        sanitized_msg = sanitize_filename_part(message)
        if sanitized_msg: # Only add if something meaningful remains after sanitization
            message_part_for_filename = f".{sanitized_msg}"

    # Construct the zip filename including the message part
    zip_filename = f"{folder_name}.{timestamp}{message_part_for_filename}.zip"
    # --- NEW CODE END ---

    zip_filepath = os.path.join(os.path.dirname(folder_path), zip_filename)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    log_file_path = os.path.join(script_dir, "zip_log.txt")

    # Prepare initial log message
    initial_log_message = (
        f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] "
        f"Zipping folder: {folder_path} | "
        f"Output: {zip_filepath}"
    )
    if message:
        initial_log_message += f" | Message: \"{message}\""
    initial_log_message += "\n"

    # Write initial log before compression
    with open(log_file_path, "a") as log_file:
        log_file.write(initial_log_message)

    # Count total files
    total_files = sum(len(files) for _, _, files in os.walk(folder_path))

    file_count = 0
    # Added explicit 'allowZip64=True' for potentially large zips
    with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED, allowZip64=True) as zipf, tqdm(total=total_files, unit='file') as pbar:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                abs_file_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_file_path, os.path.dirname(folder_path))

                # Ensure the created zip file itself is not included if it's in the target folder
                if os.path.abspath(abs_file_path) == os.path.abspath(zip_filepath):
                    continue

                zipf.write(abs_file_path, rel_path)
                file_count += 1
                pbar.update(1)

    duration = time.time() - start_time
    print(f"\nCreated zip: {zip_filepath}")
    print(f"Total files zipped: {file_count}")
    print(f"Time taken: {duration:.2f} seconds")

    # Append final log details
    final_log_message = (
        f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | "
        f"Files zipped: {file_count} | "
        f"Duration: {duration:.2f} sec\n"
    )

    with open(log_file_path, "a") as log_file:
        log_file.write(final_log_message)

if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_FOLDER
    message = sys.argv[2] if len(sys.argv) > 2 else None
    zip_folder(folder, message)

# how to use it
# python /Users/username/PersonalWebsiteDemo/00_scripts/backup_PersonalWebsite.py /Users/username/PersonalWebsiteDemo/ ""
#

