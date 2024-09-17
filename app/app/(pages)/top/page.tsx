"use client";

import ReservationPage from "@/app/components/Reservation";
import ReservationPage_isAdmin from "@/app/components/Reservation_isAdmin";
import SidePage from "@/app/components/SidePage";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserInfo_by_userId } from "@/app/utils/functions";
import { faRegistered } from "@fortawesome/free-solid-svg-icons/faRegistered";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopPage() {
  const router = useRouter();
  const { userId, accessToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await getUserInfo_by_userId(userId)
          .then((data) => {
            setIsAdmin(data.is_admin);
          })
          .catch((error) => {
            console.error(error);
            router.push("/login");
          });
      }
    };
    fetchData();
  }, [userId]);

  return (
    <>
      {accessToken && (
        <div className="flex flex-col">
          {isAdmin && (
            <div className="mt-2 mb-3 ml-14">
              <Link href="/dashboard" className="text-lg font-bold pb-1 border-b-2 border-yellow-300">
                <FontAwesomeIcon icon={faRegistered} className="text-3xl pl-2" />
                <span className="ml-2 pr-2">Dashboard →</span>
              </Link>
            </div>
          )}
          <div className="flex align-top">
            <div className="w-[25%]">
              <SidePage />
            </div>
            <div className="w-[75%]">{isAdmin ? <ReservationPage_isAdmin /> : <ReservationPage />}</div>
          </div>
        </div>
      )}
    </>
  );
}
