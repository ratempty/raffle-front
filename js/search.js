const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const value = urlParams.get("value");

async function search(value) {
  try {
    const response = await fetch(
      `https://www.backraffles.shop/search?query=${value}`
    );
    if (!response.ok) {
      throw new Error("네트워크 오류: " + response.status);
    }
    const result = await response.json();
    const data = result.data;
    renderResults(data);
  } catch (error) {
    console.error("네트워크 오류:", error);
    // 오류 처리
  }
}

function renderResults(results) {
  const rafflesContainer = document.getElementById("raffles-result");
  const shoesContainer = document.getElementById("shoes-result");
  const newsContainer = document.getElementById("news-result");

  // 각 컨테이너가 null인지 확인하고 아닌 경우에만 innerHTML을 설정합니다.
  if (rafflesContainer) {
    rafflesContainer.innerHTML = "";
  }
  if (shoesContainer) {
    shoesContainer.innerHTML = "";
  }
  if (newsContainer) {
    newsContainer.innerHTML = "";
  }

  // results.data가 배열인지 확인하고 배열인 경우에만 처리합니다.
  if (Array.isArray(results)) {
    results.forEach((result) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.addEventListener("click", () => {
        // 각 결과 유형에 따라 다른 링크를 생성합니다.
        if (result.hasOwnProperty("subName")) {
          // 응모 정보인 경우, 응모 페이지로 이동
          window.location.href = `/html/detail_raffle.html?shoeCode=${result.shoeCode}`;
        } else if (result.hasOwnProperty("title")) {
          // 뉴스 정보인 경우, 뉴스 페이지로 이동
          window.location.href = `/html/detail_news.html?newsId=${result.id}`;
        } else {
          // 신발 정보인 경우, 신발 페이지로 이동
          window.location.href = `/html/detail_market.html?shoeId=${result.id}`;
        }
      });

      if (result.hasOwnProperty("subName")) {
        const curr = result.name;
        let h3Contents = []; // 문서에서 모든 h3 요소를 선택합니다.
        const h3Elements = document.querySelectorAll("h3");
        h3Elements.forEach((h3) => {
          h3Contents.push(h3.textContent);
        });
        if (!h3Contents.includes(curr)) {
          const rafflesName = document.createElement("h3");
          rafflesName.textContent = result.name;
          card.appendChild(rafflesName);

          const rafflesSubName = document.createElement("p");
          rafflesSubName.textContent = result.subName;
          card.appendChild(rafflesSubName);

          if (rafflesContainer) {
            const image = document.createElement("img");
            image.src = result.imgUrl;
            card.appendChild(image);
            rafflesContainer.appendChild(card);
          }
        }
      } else if (result.hasOwnProperty("title")) {
        const newsTitle = document.createElement("h3");
        newsTitle.textContent = result.title;
        card.appendChild(newsTitle);

        if (newsContainer) {
          const image = document.createElement("img");
          image.src = result.newsImg;
          card.appendChild(image);
          newsContainer.appendChild(card);
        }
      } else {
        const name = document.createElement("h3");
        name.textContent = result.name;
        card.appendChild(name);

        if (shoesContainer) {
          const data = result.imgUrl;
          const parse = JSON.parse(data);
          const image = document.createElement("img");
          image.src = parse.imageUrl;
          card.appendChild(image);
          shoesContainer.appendChild(card);
        }
      }
    });
  } else {
    console.error("Results data is not an array:", results.data);
  }
}

search(value);
