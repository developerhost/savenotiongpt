# load necessary components
from trafilatura import fetch_url, extract

# download a web page
# url = 'https://github.blog/2019-03-29-leader-spotlight-erin-spiceland/'
url = 'https://qiita.com/app_js/items/ac2cf4639ede5b7aede3'
downloaded = fetch_url(url)
downloaded is None  # assuming the download was successful
False

# extract information from HTML
result = extract(downloaded)
print(result)
# newlines preserved, TXT output ...