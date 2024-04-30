const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shoeId = urlParams.get("shoeId");

fetch(`https://www.backraffles.shop/markets/${shoeId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    shoeDetailRender(data);
    marketDetailRender(data);
  })
  .catch((error) => console.error("Error:", error));

const shoeDetailRender = (data) => {
  const shoesInfo = data.shoesInfo;
  const { brand, imageUrl, name, shoeCode } = shoesInfo;

  const main = document.querySelector("#main");

  const div = document.createElement("div");
  div.classList.add("infoWrap");

  div.innerHTML = `
  <img src = ${imageUrl} alt=${name} />
  <div class= 'infos'>
    <p class="brand">${brand}</p>
    <p class="name">${name}</p>
    <p class="shoeCode">신발 코드 : ${shoeCode}</p>
  </div>
`;

  main.appendChild(div);
};

const marketDetailRender = (data) => {
  const posts = data.posts;

  const main = document.querySelector("#main");

  // 해당 신발의 판매글이 없을 경우
  if (posts.length === 0) {
    const p = document.createElement("p");
    p.innerHTML = `<p>해당 신발의 판매글이 없습니다.</p>`;
    main.appendChild(p);
  } else {
    // 판매글이 있는 경우
    const marketList = document.createElement("ul");
    marketList.classList.add("marketList");

    // 각 판매글을 리스트로 표시
    posts.forEach((post) => {
      const listItem = document.createElement("li");
      listItem.classList.add("marketItem");

      if (post.saleStatus === 0) {
        post.saleStatus = "판매중";
      } else if (post.saleStatus === 1) {
        post.saleStatus = "예약중";
      } else {
        post.saleStatus = "판매완료";
      }

      if (post.useStatus === 0) {
        post.useStatus = "새상품";
      } else {
        post.useStatus = "중고";
      }

      listItem.innerHTML = `
      <div class="market_post">
          <div id="${post.id}">
          <p class="title">제목: ${post.title}</p>
          <p class="status">상품상태: ${post.useStatus}</p>
          <p class="status">사이즈: ${post.size}</p>
          <p class="price">가격: ${post.price}원</p>
          <p class="saleStatus">판매상태: ${post.saleStatus}</p>
          <p class="view">조회수: ${post.view}</p> 
        </div>     
      </div>
      <hr>
      `;
      marketList.appendChild(listItem);
    });
    main.appendChild(marketList);
  }
  const createButton = () => {
    const main = document.querySelector("#main");
    const button = document.createElement("a"); // 변경된 부분: a 요소로 변경
    button.id = "postBtn";
    button.textContent = "게시글 작성";
    button.href = `/html/post_market.html`; // 추가된 부분: href 속성 추가
    localStorage.setItem("shoeId", shoeId);
    main.appendChild(button);
  };

  createButton();
  postEvent();
};

const postEvent = () => {
  const marketPostElements = document.querySelectorAll(".market_post");
  marketPostElements.forEach((element) => {
    element.addEventListener("click", () => {
      const marketId = element.querySelector("div").getAttribute("id");
      window.location.href = `/html/detail_post.html?marketId=${marketId}`;
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
