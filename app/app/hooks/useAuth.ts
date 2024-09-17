"use client";

import { checkAccessToken } from "@/app/utils/CheckAccessToken";
import { getUserInfo_by_userId } from "@/app/utils/functions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setAccessToken(localStorage.getItem("accessToken"));
    setExpiresAt(localStorage.getItem("expiresAt"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!checkAccessToken()) {
        router.push("/login");
      }
    };

    fetchData();
  }, [userId, accessToken, expiresAt, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId != null) {
        await getUserInfo_by_userId(userId)
          .then((data) => {
            if (data.is_admin === false) {
              router.push("/top");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
    fetchData(); // 修正: 非同期関数を呼び出す
  }, [userId, router]);

  return { userId, accessToken };
};
