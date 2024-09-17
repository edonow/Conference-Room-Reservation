import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: string = `${process.env.API_URL}/reserved`;

  const value: string = req.nextUrl.search;

  const params: URLSearchParams = new URLSearchParams(value);
  const room: string | null = params.get("room");
  const date: string | null = params.get("date");
  const start: string | null = params.get("start");
  const end: string | null = params.get("end");
  const number: string | null = params.get("number");
  const price: string | null = params.get("price");
  const user_id: string | null = params.get("user_id");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      room: `${room}`,
      date: `${date}`,
      start: Number(`${start}`),
      end: Number(`${end}`),
      number: Number(`${number}`),
      price: Number(`${price}`),
      user_id: `${user_id}`,
    }),
    // cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to post data: ${res.statusText}`);
  }

  let data;
  if (res.headers.get("content-type")?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return NextResponse.json(data);
}
