import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type EnvConfig = {
    UPSTASH_REDIS_TOKEN: string;
    UPSTASH_REDIS_URL: string;
};

app.use("/*", cors());
app.get("/search", async (q) => {
    try {
        const { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } = env<EnvConfig>(q);

        const startTime = performance.now();
        // ---------------------------------
        const redis = new Redis({
            url: UPSTASH_REDIS_URL,
            token: UPSTASH_REDIS_TOKEN,
        });
        const query = q.req.query("q")?.toUpperCase();
        if (!query) {
            return q.json({ res: [], message: "Empty query" }, { status: 200 });
        }

        const res = [];
        const rank = await redis.zrank("terms", query);
        if (rank !== null && rank !== undefined) {
            const temp = await redis.zrange<string[]>(
                "terms",
                rank,
                rank + 100
            );

            for (const el of temp) {
                if (!el.startsWith(query)) break;

                if (el.endsWith("*")) {
                    res.push(el.substring(0, el.length - 1));
                }
            }
        }
        // ---------------------------------
        const endTime = performance.now();
        return q.json({
            results: res,
            duration: endTime - startTime,
        });
    } catch (err) {
        console.log(err);
        return q.json({ results: [], message: "Error" }, { status: 500 });
    }
});

export const GET = handle(app);
export default app as never;
