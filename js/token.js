// AccessToken 만료 시간 가져오기
function getAccessTokenExpiration() {
  const accessTokenExp = getCookie("accessTokenExp");
  return accessTokenExp ? parseInt(accessTokenExp) : null;
}

// RefreshToken 만료 시간 가져오기
function getRefreshTokenExpiration() {
  const refreshTokenExp = getCookie("refreshTokenExp");
  return refreshTokenExp ? parseInt(refreshTokenExp) : null;
}

// 토큰 만료 시간이 지나면 삭제
function handleTokenExpiration() {
  const accessTokenExp = getAccessTokenExpiration();
  const refreshTokenExp = getRefreshTokenExpiration();

  // AccessToken 만료 시간이 지나면 삭제
  if (accessTokenExp && accessTokenExp < Date.now()) {
    deleteCookie("accessToken");
    deleteCookie("accessTokenExp");
    deleteCookie("userId");
  }

  // RefreshToken 만료 시간이 지나면 삭제
  if (refreshTokenExp && refreshTokenExp < Date.now()) {
    deleteCookie("refreshToken");
    deleteCookie("refreshTokenExp");
  }
}

// 쿠키에서 특정 이름의 쿠키값 가져오기
function getCookie(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

// 쿠키 삭제
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log("삭제");
}

// 주기적으로 토큰 만료 시간 확인하여 삭제
setInterval(handleTokenExpiration, 10000); // 30초마다 확인
