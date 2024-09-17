import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: string = `${process.env.API_URL}/users/me/`;
  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);
  const token: string | null = params.get("token");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  let data;
  if (res.headers.get("content-type")?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return NextResponse.json(data);
}
