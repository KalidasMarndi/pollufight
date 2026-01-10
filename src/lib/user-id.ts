export function getUserId(): string {
  const STORAGE_KEY = "pollufight_user_id";
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    userId = `user_${timestamp}_${randomString}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
