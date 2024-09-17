import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const value: string = req.nextUrl.search;
  const params: URLSearchParams = new URLSearchParams(value);
  const reservatedId: string | null = params.get("reservatedId");
  const url: string = `${process.env.API_URL}/reserved/${reservatedId}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
