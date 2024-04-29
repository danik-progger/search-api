"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
// import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [input, setInput] = useState<string>("");
    const [result, setResult] = useState<{
        results: string[];
        duration: number;
    }>();

    useEffect(() => {
        const fetchData = async () => {
            if (!input) setResult(undefined);

            const res = await fetch(`/api/search?q=${input}`);
            const data = (await res.json()) as {
                results: string[];
                duration: number;
            };
            setResult(data);
        };
        fetchData();
        console.log(input);
    }, [input]);
    return (
        <main className="h-screen w-screen grainy-background flex flex-col items-center">
            <section className="flex flex-col items-center gap-6 pt-32 duration-1000 animate-in animate fade-in-5 slide-in-from-bottom-2.5 mb-10">
                <h1 className="text-5xl tracking-tight font-bold">
                    Search for any Country ⚡
                </h1>
                <p className="text-zink-600 text-lg max-w-pose text-center">
                    A high performance API build with Hono, Next.js and
                    Cloudlare
                    <br />
                    Type a query below and get your results
                </p>
            </section>
            <div className="w-full max-w-md">
                <Command>
                    <CommandInput
                        value={input}
                        onValueChange={setInput}
                        placeholder="Search..."
                        className="placeholder:text-zinc-5000"
                    />
                    <CommandList>
                        {result?.results?.length === 0 ? (
                            <CommandEmpty>Nothing found</CommandEmpty>
                        ) : null}{" "}
                        {result?.results ? (
                            <CommandGroup>
                                {result.results.map((el) => (
                                    <CommandItem
                                        key={el}
                                        value={el}
                                        onSelect={setInput}
                                    >
                                        {el}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ) : null}
                        {result?.results ? (
                            <>
                                <div className="h-px w-full bg-zinc-200"/>
                                <p className="p-2 text-xs text-zinc-500">
                                    Found {result.results.length} results in{" "}
                                    {result.duration.toFixed(0)}ms
                                </p>
                            </>
                        ) : null}{" "}
                    </CommandList>
                </Command>
            </div>
            {/* <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            /> */}
        </main>
    );
}
