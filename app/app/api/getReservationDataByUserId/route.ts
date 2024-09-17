import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);
  const userId: string | null = params.get("userId");

  const url: string = `${process.env.API_URL}/reserved/user/${userId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // "Cache-Control": "no-cache",
    },
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
