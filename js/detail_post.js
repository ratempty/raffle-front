const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const marketId = urlParams.get("marketId");
const shoeId = urlParams.get("shoeId");

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
fetch(`https://www.backraffles.shop/markets/shoes/${marketId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    postDetailRender(data);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const marketId = urlParams.get("marketId");
    loadComments(marketId);
  })
  .catch((error) => console.error("Error:", error));

const postDetailRender = (data) => {
  const {
    userId,
    title,
    content,
    updatedAt,
    size,
    view,
    imgUrl,
    saleStatus,
    price,
    useStatus,
  } = data;

  // getUser(userId);
  let saleStatusText;
  let saleStatusId;
  if (saleStatus === 0) {
    saleStatusText = "판매중";
    saleStatusId = "sales";
  } else if (saleStatus === 1) {
    saleStatusText = "예약중";
    saleStatusId = "reserve";
  } else {
    saleStatusText = "판매완료";
    saleStatusId = "completed";
  }

  let useStatusText;
  if (useStatus === 0) {
    useStatusText = "새상품";
  } else {
    useStatusText = "중고";
  }

  let date = updatedAt.split("T")[0];
  const main = document.querySelector("#main");

  const div = document.createElement("div");
  div.classList.add("post_infoWrap");

  div.innerHTML = `
    <div class="post_head">
      <span class="saleStatus" id="${saleStatusId}">${saleStatusText}</span>
      <span class="title">${title}</span>
    </div>

    <span class="view">조회수: ${view} | </span>
    <span class="date">작성일: ${date}</span>
    <div class="post_button">
        <ul>
          <li><a id="updateButton" style="cursor: pointer">수정</a></li>
          <li>|</li>
          <li><a id="deleteButton" style="cursor: pointer">삭제</a></li>
        </ul>
    </div>
    <div class="post_content">
      <div id="imageContainer"></div>
      <p class="content">${content}</p>
      <table>
        <tr>
            <th colspan="2" style="text-align: center">판매 제품 정보</th>
        </tr>
        <tr>
            <th>제품 상태</th>
            <td>${useStatusText}</td>
        </tr>
        <tr>
            <th>가격</th>
            <td>${price}</td>
        </tr>
        <tr>
            <th>사이즈</th>
            <td>${size}</td>
        </tr>
      </table>
    </div>
    <div class='commentWrap'>
      <label for="content">댓글 내용:</label>
      <textarea id="content" name="content" rows="4" cols="50"></textarea><br>
      <button id="submitCommentButton" style="cursor: pointer">댓글 생성</button>
      <div id="commentList">
      <!-- 이 곳에 댓글이 추가될 것입니다. -->
      </div>
    </div>
  `;

  main.appendChild(div);

  // 수정 버튼 클릭 이벤트 리스너 추가
  const updateButton = document.getElementById("updateButton");
  updateButton.addEventListener("click", () => {
    if (getAccessTokenFromCookie() === null) {
      window.location.href = "/html/login.html";
      return;
    }
    const userId = getUserIdFromLocalStorage();

    // 게시글의 userId 가져오기
    const postUserId = getUserIdFromPost(data);

    // 로컬 스토리지에서 가져온 userId와 게시글의 userId 비교
    if (+userId !== postUserId) {
      // 로컬 스토리지에서 가져온 userId와 게시글의 userId가 일치하지 않으면 수정 불가
      alert("본인의 게시글이 아닙니다.");
      return;
    }

    // 로컬 스토리지에서 가져온 userId와 게시글의 userId가 일치하면 수정 페이지로 이동
    window.location.href = `/html/patch_post.html?shoeId=${shoeId}`;
  });

  // 삭제 버튼 클릭 이벤트 리스너 추가
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", async () => {
    if (getAccessTokenFromCookie() === null) {
      window.location.href = "/html/login.html";
      return;
    }
    const userId = localStorage.getItem("userId");

    // 게시글의 userId 가져오기
    const postUserId = getUserIdFromPost(data);

    // 로컬 스토리지에서 가져온 userId와 게시글의 userId 비교
    if (+userId !== postUserId) {
      console.log(typeof userId, typeof postUserId);
      // 로컬 스토리지에서 가져온 userId와 게시글의 userId가 일치하지 않으면 삭제 불가
      alert("본인의 판매글이 아닙니다.");
      return;
    }

    const confirmed = confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      // 삭제 요청 보내는 로직 추가
      deletePost(marketId);
    }
  });

  //댓글 생성
  const submitCommentButton = document.querySelector("#submitCommentButton");
  submitCommentButton.addEventListener("click", async () => {
    if (getAccessTokenFromCookie() === null) {
      window.location.href = "/html/login.html";
      return;
    }
    const content = document.getElementById("content").value;
    createComment(marketId, content);
  });

  // imgUrl 배열에 있는 이미지 URL을 표시
  const imageContainer = document.getElementById("imageContainer");
  imgUrl.forEach((imageUrl) => {
    console.log(imageUrl);
    fetchAndDisplayImage(imageUrl, imageContainer);
  });
};

const getUser = (userId) => {
  fetch(`https://www.backraffles.shop/user/profile/${userId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
};

// 판매글 삭제 요청 보내는 함수
const deletePost = async (marketId) => {
  const accessToken = getAccessTokenFromCookie();
  const response = await fetch(
    `https://www.backraffles.shop/markets/shoes/${marketId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (response.ok) {
    alert("판매글이 성공적으로 삭제되었습니다.");
    window.location.href = `/html/market.html`;
  } else {
    alert("본인의 판매글이 아닙니다.");
  }
};

// 로컬 스토리지에서 userId를 가져오는 함수
function getUserIdFromLocalStorage() {
  // 여기서는 로컬 스토리지에서 userId를 가져오는 로직을 작성합니다.
  // 만약 userId를 "userId"라는 키로 저장했다면 다음과 같이 작성할 수 있습니다.
  return localStorage.getItem("userId");
}

function getUserIdFromPost(data) {
  return data.userId;
}

// 계속 테스트할거라.. 나중에 주석 해제하기
// s3에서 이미지를 가져와서 화면에 표시하는 함수
function fetchAndDisplayImage(imageUrl, container) {
  const img = new Image();
  img.src = `https://bucket-raffle.s3.ap-northeast-2.amazonaws.com/${imageUrl}`; // 수정된 부분
  img.onload = () => {
    // 이미지를 표시할 div를 생성하고 이미지를 추가합니다.
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("imageItem"); // 이미지 스타일을 추가할 수 있습니다.
    imageDiv.appendChild(img);

    // 이미지 컨테이너에 이미지 div를 추가합니다.
    container.appendChild(imageDiv);
  };
  img.onerror = (error) => {
    console.error("이미지를 가져오는 중 오류가 발생했습니다.", error);
  };
}

const loadComments = async (marketId) => {
  try {
    const response = await fetch(
      `https://www.backraffles.shop/comments/markets/${marketId}`
    );
    if (!response.ok) {
      throw new Error("댓글을 불러오는 데 실패했습니다.");
    }
    const comments = await response.json();
    // 불러온 댓글을 화면에 표시하는 함수 호출
    displayComments(comments);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
const displayComments = (comments) => {
  const commentsContainer = document.getElementById("commentList");
  // 이전에 표시된 댓글들을 모두 지웁니다.
  commentsContainer.innerHTML = "";

  const userId = getUserIdFromLocalStorage(); // 현재 사용자의 아이디 가져오기

  comments.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.setAttribute("data-comment-id", comment.id);

    const author = document.createElement("p");
    author.textContent = "작성자: " + comment.userId;
    commentItem.appendChild(author);

    const contentElement = document.createElement("p");
    contentElement.textContent = comment.content;
    commentItem.appendChild(contentElement);

    // 수정 버튼 추가
    if (+userId === comment.userId) {
      const editButton = document.createElement("button");
      editButton.textContent = "수정";
      editButton.classList.add("updateButton");
      editButton.dataset.commentId = comment.id;
      editButton.addEventListener("click", () => {
        const content = prompt("댓글을 수정하세요:");
        if (content !== null) {
          updateComment(comment.id, content);
        }
      });
      commentItem.appendChild(editButton);
    }

    // 삭제 버튼 추가
    if (+userId === comment.userId) {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.classList.add("deleteButton");
      deleteButton.dataset.commentId = comment.id;
      deleteButton.addEventListener("click", () => {
        const confirmed = confirm("정말로 삭제하시겠습니까?");
        if (confirmed) {
          deleteComment(comment.id);
        }
      });
      commentItem.appendChild(deleteButton);
    }

    commentsContainer.appendChild(commentItem);
  });
};

const createComment = async (marketId, content) => {
  console.log(marketId, content);
  try {
    const response = await fetch(
      `https://www.backraffles.shop/comments/markets/${marketId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
        body: JSON.stringify({ content }),
      }
    );
    console.log("리스폰스", response);
    if (!response.ok) {
      throw new Error("댓글 생성에 실패했습니다.");
    }

    const data = await response.json();
    // 생성된 댓글을 화면에 추가하는 로직
    appendCommentToList(data.comment);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const appendCommentToList = (comment) => {
  const commentList = document.getElementById("commentList");
  const commentItem = document.createElement("div");
  commentItem.setAttribute("data-comment-id", comment.id);

  const userId = getUserIdFromLocalStorage();
  const author = document.createElement("p");
  author.textContent = "작성자: " + comment.userId;
  commentItem.appendChild(author);

  const contentElement = document.createElement("p");
  contentElement.textContent = comment.content;
  commentItem.appendChild(contentElement);

  // 수정 버튼 추가
  const editButton = document.createElement("button");
  editButton.textContent = "수정";
  editButton.classList.add("updateButton"); // 수정 버튼에 클래스 추가
  editButton.dataset.commentId = comment.id; // 댓글의 ID를 data 속성에 저장
  editButton.addEventListener("click", () => {
    const content = prompt("댓글을 수정하세요:");
    if (content !== null) {
      updateComment(comment.id, content);
    }
  });
  commentItem.appendChild(editButton);

  // 삭제 버튼 추가
  if (+userId === comment.userId) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.classList.add("deleteButton"); // 삭제 버튼에 클래스 추가
    deleteButton.dataset.commentId = comment.id; // 댓글의 ID를 data 속성에 저장
    deleteButton.addEventListener("click", () => {
      const confirmed = confirm("정말로 삭제하시겠습니까?");
      if (confirmed) {
        console.log("commentasg", commentList);
        const commentItem = commentList.querySelector(
          `[data-comment-id="${comment.id}"]`
        );
        commentItem.classList.add("sr_only");
      }
    });
    commentItem.appendChild(deleteButton);
  }

  commentList.appendChild(commentItem);
};

const updateComment = async (commentId, content) => {
  try {
    const response = await fetch(
      `https://www.backraffles.shop/comments/markets/${commentId}`, // URL에서 commentId를 사용
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error("댓글 수정에 실패했습니다.");
    }

    const data = await response.json();
    // 수정된 댓글을 화면에 업데이트하는 로직
    updateCommentOnScreen(data.comment);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// 댓글 삭제
const deleteComment = async (commentId) => {
  try {
    const response = await fetch(
      `https://www.backraffles.shop/comments/markets/${commentId}`, // URL에서 commentId를 사용
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessTokenFromCookie()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("댓글 삭제에 실패했습니다.");
    }
    alert("댓글이 삭제되었습니다.");
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// 수정된 댓글을 화면에 업데이트하는 함수
const updateCommentOnScreen = (comment) => {
  // 수정된 댓글을 화면에 반영하는 로직 구현
  const commentItem = document.querySelector(
    `[data-comment-id="${comment.id}"]`
  );
  if (commentItem) {
    const contentElement = commentItem.querySelector(".comment-content");
    if (contentElement) {
      contentElement.textContent = comment.content;
    }
    alert("댓글이 수정되었습니다.");
    location.reload();
  }
};
