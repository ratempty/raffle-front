const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const shoeCode = urlParams.get("shoeCode");

fetch(`https://www.backraffles.shop/raffles/${shoeCode}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    shoeDetailRender(data);
    raffleDetailRender(data);
  })
  .catch((error) => console.error("Error:", error));

const shoeDetailRender = (raffle) => {
  const { id, brand, imgUrl, name, subName, relPrice, shoeCode } = raffle[0];
  const main = document.querySelector("#main");

  const div = document.createElement("div");
  div.classList.add("infoWrap");

  div.innerHTML = `
    <img src = ${imgUrl} alt=${name} />
    <div class= 'infos'>
      <p class="brand">${brand}</p>
      <p class="name">${name}</p>
      <p class="subName">${subName}</p>
      <p class="shoeCode">신발 코드 : ${shoeCode}</p>
    </div>
  `;

  main.appendChild(div);
};

const raffleDetailRender = (raffles) => {
  raffles.forEach((raffle) => {
    const {
      id,
      relPrice,
      releaseMarketIcon,
      releaseMarketName,
      raffleUrl,
      raffleStartDate,
      raffleEndDate,
    } = raffle;

    const main = document.querySelector("#main");

    const div = document.createElement("div");
    div.classList.add("raffleWrap");
    const releaseStartDate = raffleStartDate ? new Date(raffleStartDate) : null;
    const releaseEndDate = new Date(raffleEndDate);

    const options = { timeZone: "Asia/Seoul" };
    const localStartDate = releaseStartDate
      ? releaseStartDate.toLocaleString("ko-KR", options)
      : "";
    const localEndDate = releaseEndDate.toLocaleString("ko-KR", options);

    const releaseDate = releaseStartDate
      ? localStartDate + " ~ " + localEndDate
      : "~ " + localEndDate;

    div.innerHTML = `
    <img src = ${releaseMarketIcon} alt='' />
    <div class= 'raffleinfos'>
      <p class="marketName">${releaseMarketName}</p>
      <p class="raffleDate">응모 기간 : ${releaseDate}</p>
      <p class="rafflePrice">응모 가격 : ${relPrice}</p>
      <button type='button' class = 'raffleBtn goRaffle' data-url=${raffleUrl}>
        응모하기
      </button>
      <button type='button' class = 'raffleBtn goUserRaffle' data-raffleId=${id}>
        참여 체크
      </button>
    </div>
  `;

    main.appendChild(div);
  });

  const goRaffleArr = main.querySelectorAll(".goRaffle");
  const goUserRaffleArr = main.querySelectorAll(".goUserRaffle");
  addEvent(goRaffleArr, goUserRaffleArr);
};

const addEvent = (goRaffle, goUserRaffle) => {
  goRaffle.forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      window.open(url, "_blank");
    });
  });

  goUserRaffle.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-raffleId");
      if (getAccessTokenFromCookie() === null) {
        window.location.href = "/html/login.html";
      } else {
        checkRaffle(id);
      }
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

function checkRaffle(raffleId) {
  showModal("참여 여부를 선택해주세요.", raffleId);
}

// 모달 열기 함수
function showModal(message, raffleId) {
  const modal = document.getElementById("myModal");
  const modalContent = modal.querySelector(".modal-content");
  const modalMessage = modalContent.querySelector("p");
  const participateBtn = modalContent.querySelector("#participateBtn");
  const cancelBtn = modalContent.querySelector("#cancelBtn");

  modalMessage.textContent = message; // 모달에 메시지 표시

  modal.style.display = "block"; // 모달 열기

  // 참여 버튼 클릭 시 이벤트 설정
  participateBtn.onclick = async () => {
    const accessToken = getAccessTokenFromCookie();
    const response = await fetch(
      `https://www.backraffles.shop/raffles/${raffleId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      alert("참여 완료했습니다.");
      modal.style.display = "none"; // 모달 닫기
    } else {
      alert("이미 참여한 응모입니다.");
    }
  };

  // 취소 버튼 클릭 시 이벤트 설정
  cancelBtn.onclick = async () => {
    const accessToken = getAccessTokenFromCookie();
    const response = await fetch(
      `https://www.backraffles.shop/raffles/${raffleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      alert("참여 취소했습니다.");
      modal.style.display = "none"; // 모달 닫기
    } else {
      alert("참여한 응모가 아닙니다.");
    }
  };

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 사용자가 모달 외부를 클릭할 때 모달 닫기
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}
