import requests
from requests import Response
from bs4 import BeautifulSoup

from typing import List

SEARCH_ENGINE: str = "https://google.com/search?q="


def parse_text_from_website(url: str) -> str | None:
    headers = {"User-Agent": "Mozilla/5.0"}
    response: Response = requests.get(url=url, headers=headers)

    if not response.status_code == 200:
        print(f"Failed to retrieve webpage: {response.status_code}")
        return None

    soup: BeautifulSoup = BeautifulSoup(markup=response.content, features="html.parser")

    text: str = soup.get_text()

    return text


def parse_links_from_query(query: str) -> List[str]:
    response = requests.get(url=SEARCH_ENGINE + query)
    output_links: List[str] = []

    if response.status_code == 200:
        soup: BeautifulSoup = BeautifulSoup(
            markup=response.content, features="html.parser"
        )
        links = soup.find_all("a")

        for i in range(len(links)):
            if i < 10:
                continue
            elif i > len(links) - 20:
                continue

            link: str = links[i].get("href")
            if link.startswith("/url?q="):
                link = link[7:]

            # if len(output_links) > 2:
            # break
            if link.startswith("https://"):
                output_links.append(link)

    return output_links


if __name__ == "__main__":
    links = parse_links_from_query("how to make pancakes")
    for i in range(len(links)):
        print(f"{i}: {links[i]}")

    # for link in links:
    #     text = parse_text_from_website(url=link)
    #     print(text)
