fetch("https://www.backraffles.shop/news")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    newsRender(data);
  })
  .catch((error) => console.error("Error:", error));

const newsRender = (data) => {
  const main = document.querySelector("#main");
  const container = main.querySelector(".news_container");

  data.forEach((news) => {
    const div = document.createElement("div");

    div.setAttribute("data-id", news.id);
    div.classList.add("newsBox");
    div.innerHTML = `
      <img src="${news.newsImg}" alt="${news.title}"/>
      <div class='textWrap'>
      <h2 class='title'>${news.title}</h2>
      <p class='subTitle'>${news.subTitle}</p>
      </div>
    `;

    container.appendChild(div);
  });

  const newsBox = container.querySelectorAll(".newsBox");

  newsBox.forEach((news) => {
    news.addEventListener("click", () => {
      const id = news.getAttribute("data-id");
      window.location.href = `/html/detail_news.html?newsId=${id}`;
    });
  });
};

function getAccessTokenFromCookie() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("access_token=")
  );
  if (accessTokenCookie) {
    return accessTokenCookie.split("=")[1];
  }
  return null;
}

const goMyPage = () => {
  const myPageBtn = document.querySelector(".tnb img");
  myPageBtn.addEventListener("click", () => {
    if (getAccessTokenFromCookie() === null) {
      window.location.href = "/html/login.html";
    } else {
      window.location.href = "/html/myPage.html";
    }
  });
};

goMyPage();
