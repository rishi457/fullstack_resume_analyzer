import requests
from bs4 import BeautifulSoup
import re

def extract_jd_text(url: str) -> str:
    """
    Extracts text from a job description URL.
    Attempts to find common job board content areas.
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script_or_style in soup(["script", "style"]):
            script_or_style.decompose()

        # Common job description selectors (generic for many sites)
        potential_content = []
        
        # Try finding the main article or description container
        main_content = soup.find('article') or soup.find('main') or soup.find(id=re.compile(r'job-description|description|jd', re.I))
        
        if main_content:
            text = main_content.get_text(separator=' ')
        else:
            # Fallback: Get all text from body
            text = soup.body.get_text(separator=' ') if soup.body else soup.get_text(separator=' ')

        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        # Basic heuristic to limit size and junk
        if len(text) > 10000:
            text = text[:10000]
            
        return text
    except Exception as e:
        print(f"Scraping Error: {e}")
        return ""
