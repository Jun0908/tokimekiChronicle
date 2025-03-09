# Farcaster User Profile Generator

## Overview
This project retrieves user data from Farcaster and generates a structured JSON profile using OpenAI's GPT-4 API. It fetches user details, posts, and engagement data to create an insightful summary of their online presence.

## Features
- Fetch user FID from Farcaster Name Service
- Retrieve recent posts using the Pinata API
- Get user profile information from Hubble API
- Generate a JSON-based user profile using OpenAI GPT-4

## Prerequisites
- Python 3.9+
- OpenAI API Key
- Pinata API JWT Token

## Setup
### 1️⃣ Create a Virtual Environment
```bash
python -m venv venv
```

### 2️⃣ Activate the Virtual Environment
#### macOS/Linux:
```bash
source venv/bin/activate
```
#### Windows (Command Prompt):
```Command Prompt
venv\Scripts\Activate
```

### 3️⃣ Install Required Libraries
```bash
pip install -r requirements.txt
```


### 4️⃣ Set Up API Keys
Create an `.env` file in the root directory and add your API keys:
```ini
OPENAI_API_KEY=your_openai_api_key
PINATA_JWT=your_pinata_jwt
```

## Usage
Before running the script, ensure you have the correct Farcaster Forecaster name. You may need to find it manually before using the tool.

Run the script with a specified username:
```bash
python main.py
```
Modify `username` inside `main.py` as needed.

## File Structure
```
.
├── main.py  # Main script to execute the user profile generation
├── requirements.txt  # List of dependencies
├── README.md  # Project documentation
├── .env  # Environment variables (ignored by Git)
└── venv/  # Virtual environment (excluded from version control)
```

## Output
After running the script, the JSON profile will be saved as `{username}_profile.json`.

## License
MIT License

## Author
Your Name
