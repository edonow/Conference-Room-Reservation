// utils/CheckAccessToken.ts

export function checkAccessToken() {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const expiresAt = localStorage.getItem("expiresAt");

  if (expiresAt && new Date() > new Date(expiresAt)) {
    // アクセストークンの有効期限が過ぎていたら削除
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    return false;
  }
  if (!userId || !accessToken || !expiresAt) {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    return false;
  }

  return true;
}
