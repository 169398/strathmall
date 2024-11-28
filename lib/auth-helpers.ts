import { auth } from "@/auth";

export async function getAuthWithTimeout(timeoutMs = 5000) {
  try {
    const authPromise = auth();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Auth timeout"));
      }, timeoutMs);
    });

    const session = await Promise.race([authPromise, timeoutPromise]);
    return session;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
