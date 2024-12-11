import { Pool } from "@neondatabase/serverless";

class DatabasePool {
  private static instance: Pool;
  private static readonly MAX_CONNECTIONS = 20;
  private static readonly IDLE_TIMEOUT = 10000;
  private static readonly CONNECTION_TIMEOUT = 3000;

  public static getInstance(): Pool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new Pool({
        connectionString: process.env.POSTGRES_URL,
        max: this.MAX_CONNECTIONS,
        idleTimeoutMillis: this.IDLE_TIMEOUT,
        connectionTimeoutMillis: this.CONNECTION_TIMEOUT,
      });
    }
    return DatabasePool.instance;
  }

  public static async query(text: string, params?: any[]) {
    const pool = DatabasePool.getInstance();
    const start = Date.now();

    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;

      // Log slow queries (over 100ms)
      if (duration > 100) {
        console.warn("Slow query:", { text, duration, rows: result.rowCount });
      }

      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }
}

export const db = DatabasePool;
