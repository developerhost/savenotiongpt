import trafilatura
import openai
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')


# ユーザーにURLの入力を促す
url = input("Please enter the URL: ")


# ウェブページからテキストを抽出
downloaded = trafilatura.fetch_url(url)
blog_text = trafilatura.extract(downloaded)




# 抽出されたテキストを表示（オプション）
if blog_text:
    
    # print(blog_text)
    
    summary_prompt =f"""
    #Order
    Please summarize the following blog post.

    #Conditions
    - The text should be in Japanese.
    - Add appropriate line breaks.
    - The text should be about 200 characters.

    ====

    #text
    {blog_text}
    """
    
    summary_llm = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "user", "content": summary_prompt}
        ],
        temperature=0.2
    )
    
    print(summary_llm["choices"][0]["message"]["content"])
    
    
    tag_prompt=f"""
    #Order
    From the text below, come up with a unique and appropriate tag that succinctly describes its content in one word and generate one tag.

    #Conditions
    - The text should be in Japanese.
    - The response should always be one word of the tag.
    - No statements other than the tag are allowed.
    
    ====

    #text
    {summary_llm["choices"][0]["message"]["content"]}
    """
    tag_llm = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "user", "content": tag_prompt}
        ],
        temperature=0.2
    )
    
    print(tag_llm["choices"][0]["message"]["content"])
    
else:
    print("blog_text extraction failed")