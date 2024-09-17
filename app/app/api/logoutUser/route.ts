import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url: string = `${process.env.API_URL}/logout`;

  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);
  const token: string | null = params.get("token");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to post data: ${res.statusText}`);
  }

  const data = await res.json();

  return NextResponse.json(data);
}
