import os
import requests
import json
import openai
import re
import traceback

# APIキー
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINATA_JWT = os.getenv("PINATA_JWT")

client = openai.OpenAI(api_key=OPENAI_API_KEY)

# API エンドポイント
FNAME_API = "https://fnames.farcaster.xyz/transfers/current?name={}"
FARCASTER_PROFILE_API = "https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid={}"
FARCASTER_POSTS_API = "https://api.pinata.cloud/v3/farcaster/casts?fid={}&limit=50&order=desc"

HEADERS = {"User-Agent": "Mozilla/5.0"}

def fetch_fid(username):
    """ユーザー名からFIDを取得"""
    url = FNAME_API.format(username)
    print(f"🔍 Fetching FID for username: {username}")
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        return data.get("transfer", {}).get("to")
    except Exception as e:
        print(f"❌ Error getting FID: {e}")
        return None

def fetch_posts(fid):
    """FIDから投稿とバイオを取得"""
    url = FARCASTER_POSTS_API.format(fid)
    headers = {"accept": "application/json", "authorization": f"Bearer {PINATA_JWT}"}
    print(f"🔍 Fetching posts for FID: {fid}")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        posts_data = response.json()
        
        # Bioの抽出
        author_data = posts_data.get("casts", [])[0].get("author", {})
        bio = author_data.get("bio", "No bio available.")
        
        # Postの抽出
        posts = [cast.get("text", "") for cast in posts_data.get("casts", []) if "text" in cast]
        posts = posts if posts else ["No posts available."]
        
        return bio, posts
    except Exception as e:
        print(f"❌ Error getting posts: {e}")
        return "No bio available.", ["No posts available."]

def generate_json_profile(username, bio, posts):
    """JSONプロフィールを生成"""
    print(f"🔍 Generating JSON profile for: {username}")
    
    prompt = f"""
    You are an AI assistant that generates structured JSON profiles based on user activity.

    **Rules:**
    - **MUST return JSON output ONLY** (no explanations or additional text).
    - **Infer user attributes even if data is limited**.
    - **Do not return \"Unknown\". Provide the best reasonable guess**.

    ---
    
    **User Data**
    - **Name:** {username}
    - **Bio:** {bio}
    - **Recent Posts:** {', '.join(posts)}

    ---
    
    **Output Format (JSON)**
    ```json
    {{
        "profile": {{
            "fullName": "{username}",
            "bio": "{bio}",
            "posts": {json.dumps(posts)},

            "knowledge": [
                "Extracted from bio and posts"
            ],
            "topics": [
                "Identified from user activity"
            ],
            "style": {{
                "all": ["General communication style"],
                "chat": ["How the user interacts in conversations"],
                "post": ["How the user writes posts"]
            }},
            "adjectives": [
                "Words describing the user's personality"
            ],
            "catchphrases": [
                "User's common expressions or phrases"
            ]
        }}
    }}
    ```
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        json_content = response.choices[0].message.content.strip()
        json_content = re.sub(r"```json\n|\n```", "", json_content).strip()
        json_output = json.loads(json_content)
    except Exception as e:
        print(f"❌ Error generating JSON: {e}")
        print(traceback.format_exc())
        return
    
    json_filename = f"{username}.json"
    with open(json_filename, "w", encoding="utf-8") as json_file:
        json.dump(json_output, json_file, indent=4, ensure_ascii=False)
    
    print(f"✅ JSON profile saved as {json_filename}")

def main():
    """複数のユーザーのプロフィールを生成"""
    usernames = ["hikalipikali"]  # ここに追加したいユーザー名をリストに入れる

    for username in usernames:
        fid = fetch_fid(username)
        if fid:
            bio, posts = fetch_posts(fid)
            generate_json_profile(username, bio, posts)
        else:
            print(f"❌ Could not retrieve FID for username: {username}")

if __name__ == "__main__":
    main()


