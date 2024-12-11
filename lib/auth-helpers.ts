import { auth } from "@/auth";

export async function getAuthWithTimeout(timeoutMs = 5000) {
  try {
    const authPromise = await auth();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Auth timeout"));
      }, timeoutMs);
    });

    const result = await Promise.race([authPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
