import { Redis } from "@upstash/redis";
import { countryList } from "./countryList";

const redis = new Redis({
    url: "https://social-maggot-51288.upstash.io",
    token: "AchYAAIncDFlNGU4Zjc0MGQ3OTI0NWQ0YThkMzMzOTU0OTk4OTA3M3AxNTEyODg",
});

countryList.forEach((country) => {
    const term = country.toUpperCase();
    const terms: { score: 0; member: string }[] = [];

    for (let i = 0; i < term.length; i++) {
        terms.push({
            score: 0,
            member: term.substring(0, i),
        });
    }

    terms.push({ score: 0, member: term + "*" });

    const populateDb = async () => { 
        // @ts-expect-error
        await redis.zadd("terms", ...terms);
    }

    populateDb();
});
