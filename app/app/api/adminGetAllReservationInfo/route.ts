import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);
  const token: string | null = params.get("token");

  const url: string = `${process.env.API_URL}/admin/reservations`;

  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  // Include the token in the headers if it is not null
  if (token !== null) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to get data: ${res.statusText}`);
  }

  let data;
  if (res.headers.get("content-type")?.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return NextResponse.json(data);
}
