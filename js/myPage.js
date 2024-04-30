const userId = localStorage.getItem("userId");
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

function getRefreshTokenFromCookie() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("refresh_token=")
  );
  if (refreshTokenCookie) {
    return refreshTokenCookie.split("=")[1];
  }
  return null;
}

const getProfile = async () => {
  const url = `https://www.backraffles.shop/user/profile/${userId}`;
  const access_token = getAccessTokenFromCookie();
  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestData);

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }
    const data = await response.json();
    console.log(data);
    profileRender(data);
  } catch (error) {
    console.log(error);
  }
};

getProfile();

const getUserRaffle = async () => {
  const url = `https://www.backraffles.shop/raffles/userRaffle`;
  const access_token = getAccessTokenFromCookie();
  const requestData = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestData);

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }
    const data = await response.json();
    console.log(data);
    myRaffleRender(data);
  } catch (error) {
    console.log(error);
  }
};

getUserRaffle();

const profileRender = (data) => {
  const profile = document.querySelector(".profile");

  const div = document.createElement("div");
  div.classList.add("profileWrap");
  div.innerHTML = `
  <p class = 'email'>ID :${data.email}</p>
  <p class = 'nickName'>Nickname : ${data.nickName}</p>
  <p class = 'name'>이름 : ${data.name}</p>
  <button id="updateBtn" style="cursor: pointer">정보수정</button>
  <button id="logoutBtn" style="cursor: pointer">로그아웃</button>
  `;
  profile.appendChild(div);

  const updateBtn = document.querySelector("#updateBtn");
  const logoutBtn = document.querySelector("#logoutBtn");

  updateBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    window.location.href = `/html/update_profile.html?userId=${userId}`;
  });

  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const url = `https://www.backraffles.shop/user/logout`;
    const access_token = getAccessTokenFromCookie();

    const requestData = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, requestData);

      if (response.ok) {
        clearCookies();
        window.location.href = "/";
      } else {
        console.error("로그아웃 실패:", response.status);
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
    }
  });
};
function clearCookies() {
  // 쿠키 삭제
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const cookieParts = cookie.split("=");
    const cookieName = cookieParts[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // 로컬 스토리지 비우기
  localStorage.clear();
}

const myRaffleRender = (data) => {
  const myRaffleWrap = document.querySelector(".myRaffle");

  data.forEach((raffle) => {
    const div = document.createElement("div");
    div.classList.add("myRaffleItem");
    div.innerHTML = `
    <img src="${raffle.raffle[0].imgUrl}" alt="${raffle.raffle[0].subName}" data_shoeCode="${raffle.raffle[0].shoeCode}" />
    <div class="pWrap">
    <p class="brand">${raffle.raffle[0].brand}</p>
    <p class="subName">${raffle.raffle[0].subName}</p>
    <img src="${raffle.raffle[0].releaseMarketIcon}" />
    <p class="releaseMarketName">${raffle.raffle[0].releaseMarketName}</p>
    <p class="relPrice">${raffle.raffle[0].relPrice}</p>
    </div>
    `;
    myRaffleWrap.appendChild(div);

    // 이미지 클릭 이벤트 리스너 추가
    div.querySelector("img").addEventListener("click", () => {
      const shoeCode = div.querySelector("img").getAttribute("data_shoeCode");
      goToDetailRaffle(shoeCode);
    });
  });
};

// 상세 페이지로 이동하는 함수 정의
const goToDetailRaffle = (shoeCode) => {
  window.location.href = `/html/detail_raffle.html?shoeCode=${shoeCode}`;
};
