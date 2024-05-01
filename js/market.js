let pageNum = 1;
const marketRender = async () => {
  const url = `https://www.backraffles.shop/markets?page=${pageNum}`;
  try {
    const response = await fetch(url);
    const datas = await response.json();
    console.log(datas);
    datas.forEach((data) => {
      const marketContainer = document.querySelector(".market_container");
      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = `
        <img
        src="${data.thumbUrl}"
        alt="${data.name}"
        data-id = "${data.id}"
        class= "shoeImgs"
        />
        <p class="brand">${data.brand}</p>
        <p class="name">${data.name}</p>
      `;

      marketContainer.appendChild(div);
    });
    imgEvent();
  } catch (error) {
    console.log(error);
  }
};

marketRender();

const nextBtn = document.querySelector(".nextBtn");
const prevBtn = document.querySelector(".prevBtn");

nextBtn.addEventListener("click", () => {
  const marketContainer = document.querySelector(".market_container");
  marketContainer.innerHTML = "";
  pageNum++;
  marketRender();
});

prevBtn.addEventListener("click", () => {
  const marketContainer = document.querySelector(".market_container");

  if (pageNum === 1) {
    alert("첫 페이지입니다.");
  } else {
    marketContainer.innerHTML = "";
    pageNum--;
    marketRender();
  }
});

const imgEvent = () => {
  const shoeImgs = document.querySelectorAll(".shoeImgs");

  shoeImgs.forEach((shoeImg) => {
    shoeImg.addEventListener("click", (e) => {
      const dataId = shoeImg.getAttribute("data-id");
      window.location.href = `/html/detail_market.html?shoeId=${dataId}`;
    });
  });
};
