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

const getUserRaffle = async () => {
  const url = "https://www.backraffles.shop/raffles/userRaffle";
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
    const data = await response.json();
    console.log(data);
    userRaffleRender(data);
  } catch (error) {
    console.log(error);
  }
};

let date = new Date();

const renderCalendar = () => {
  if (getAccessTokenFromCookie() === null) {
    window.location.href = "/html/login.html";
  }
  const viewYear = date.getFullYear(); // 해당 년 받아오기
  const viewMonth = date.getMonth(); // 해당 월 받아오기

  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]; // 달 이름을 영어로 출력하기 위한 배열

  document.querySelector(
    ".year-month"
  ).textContent = `${viewYear} ${monthNames[viewMonth]}`;

  const prevLast = new Date(viewYear, viewMonth, 0); // 지난달의 마지막 날 Date 객체
  const thisLast = new Date(viewYear, viewMonth + 1, 0); // 이번달의 마지막 날 Date 객체

  const PLDate = prevLast.getDate(); // 지난달의 마지막 날짜
  const PLDay = prevLast.getDay(); // 지난달의 마지막 요일

  const TLDate = thisLast.getDate(); // 이번달의 마지막 날짜
  const TLDay = thisLast.getDay(); // 이번달의 마지막 요일

  // 날짜들을 담아둘 배열
  const prevDates = []; // 이전달 날짜
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = []; // 다음달 날짜

  // Array(n) => 길이가 n인 배열 생성
  // keys() => 0부터 n -1 까지의 배열 반복자 생성(내부요소 순회) ==> 이번달 마지막 날짜 + 1을 n에 전달
  // slice(1) => 제일 앞에 있는 0을 없애기 위해

  if (PLDay !== 6) {
    // 이전 달을 표현할 날짜 생성 (지난달 마지막 요일이 토요일(6) 이면 굳이 그릴 그릴 필요 없음)
    for (let i = 0; i < PLDay + 1; i++) {
      prevDates.unshift(PLDate - i);
    }
  }

  //unshift() => 배열의 앞에 아이템을 추가한다. 새로운 요소를 배열의 맨 앞쪽에 추가하고 새로운 길이 반환
  // 0부터 시작해서 지난달 마지막 요일이 될 때까지 반복하게 작성, 지난달의 마지막 날짜부터 1씩 줄어든 값을 배열 앞쪽으로 채워넣음

  for (let i = 1; i < 7 - TLDay; i++) {
    nextDates.push(i); // 이번달 마지막 날짜의 요일을 기준으로 필요한 개수를 파악해서 1부터 1씩 증가시키며 하나씩 채워넣음
  }

  // push() => 배열의 끝에 하나 이상의 요소를 추가하고 배열의 새로운 길이 반환
  const dates = prevDates.concat(thisDates, nextDates); // concat 메서드를 통해서 세 배열을 합침
  const firstDateIndex = dates.indexOf(1); // 지난달 부분을 알아내기 위함
  const lastDateIndex = dates.lastIndexOf(TLDate); // 다음달 부분을 알아내기 위함

  dates.forEach((date, i) => {
    // 이전달과 다음달 부분의 투명도 조절 위함
    const condition =
      i >= firstDateIndex && i < lastDateIndex + 1
        ? "this" // 이번달
        : "other"; // 나머지 (span대그로 감싸 classa 로 지정)
    dates[
      i
    ] = `<button class="date"><span class="${condition}">${date}</span></button>`;
  });

  document.querySelector(".dates").innerHTML = dates.join("");

  const today = new Date(); // 오늘 날짜 표기하기 위해
  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    // 현재 월을 보고 있는게 맞는지
    for (let date of document.querySelectorAll(".this")) {
      // this 태그 찾기
      if (+date.innerText === today.getDate()) {
        // +연산자로 숫자로 변경
        date.classList.add("today"); // 해당 태그에 today 클래스 추가
        break;
      }
    }
  }

  getUserRaffle();
};

renderCalendar();

const prevMonth = () => {
  date.setDate(1); // 1일로 날짜를 먼저 설정 (31일이 포함된 달의 경우 31일이 넘어가게 되기 때문!)
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
};

const nextMonth = () => {
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
};

const goToday = () => {
  date = new Date();
  renderCalendar();
};

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

const userRaffleRender = (datas) => {
  // 이미지가 이미 생성된 날짜를 기록하기 위한 Set
  const createdDates = new Set();

  datas.forEach((data) => {
    const createdAt = new Date(data.createdAt); // createdAt 데이터를 날짜 객체로 변환
    const dateNumber = createdAt.getDate(); // 해당 데이터의 날짜를 가져옵니다.
    const dataMonth = createdAt.getMonth(); // 해당 데이터의 월을 가져옵니다.

    // 현재 보고 있는 달과 데이터의 월이 같은 경우에만 이미지를 추가합니다.
    if (dataMonth === date.getMonth()) {
      // 이미지가 이미 생성된 날짜인지 확인
      if (!createdDates.has(dateNumber)) {
        // 이미지를 추가할 요소 생성
        const raffleInfoContainer = document.createElement("div");
        raffleInfoContainer.classList.add("raffle-stamp");

        // 이미지 요소 생성
        const img = document.createElement("img");
        img.src = "../img/shoes.png"; // shoes.png 이미지의 경로 설정
        img.alt = "Shoes"; // 대체 텍스트 설정

        // 생성한 요소들을 컨테이너에 추가
        raffleInfoContainer.appendChild(img);

        // 모달 창을 열기 위한 이벤트 처리
        raffleInfoContainer.addEventListener("click", () => {
          const modal = document.getElementById("myRaffle");
          const modalContent = modal.querySelector(".modal-content");
          const modalMessage = modalContent.querySelector("p");

          // 해당 날짜의 모든 raffle 내용을 모달에 추가
          const raffleMessages = datas
            .filter((item) => {
              const itemDate = new Date(item.createdAt);
              return itemDate.getDate() === dateNumber;
            })
            .map((item) => {
              return `<p>[${item.raffle[0].releaseMarketName}] ${item.raffle[0].subName}</p>`;
            })
            .join("");

          // 모달 내용 설정
          modalMessage.innerHTML = raffleMessages;

          // 모달 표시
          modal.style.display = "block";
        });

        // 이미지가 생성된 날짜를 기록
        createdDates.add(dateNumber);

        // 해당 날짜 버튼에 정보 컨테이너를 추가
        const dateButtons = document.querySelectorAll(".this");
        for (let dateButton of dateButtons) {
          // this 태그 찾기
          if (+dateButton.innerText === dateNumber) {
            // +연산자로 숫자로 변경
            dateButton
              .closest(".date")
              .querySelector(".this")
              .appendChild(raffleInfoContainer);
            break;
          }
        }
      }
    }
  });

  // 모달창 닫기 버튼 및 외부 클릭 시 닫기 기능 추가
  const modal = document.getElementById("myRaffle");
  const closeButton = modal.querySelector(".close");

  // 모달 닫기 버튼 클릭 이벤트 처리
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 모달 외부를 클릭하면 모달 닫기
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
