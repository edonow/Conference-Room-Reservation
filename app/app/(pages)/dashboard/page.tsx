"use client";

import Header_by_AccessToken from "@/app/components/HeaderAdmin";
import { useAuth } from "@/app/hooks/useAuth";
import { adminGetAllUserInfo_by_accessToken } from "@/app/utils/functions";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { TotalAmountByMonthForThePastYear_Bar } from "./getTotalAmountByMonthForThePastYear";
import { TotalAmountByRoomOverThePastYear_for_Bar } from "./getTotalAmountByRoomOverThePastYear";
import { TotalAmountForEachRoomTheNetTwoMonth_for_Bar } from "./getTotalAmountForEachRoomTheNetTwoMonth";
import { UsageInTheNextMonth_for_CircleData } from "./getUsageInTheNextMonth_for_CircleData";
import { UsageInThePastYear_for_CircleData } from "./getUsageInThePastYear_for_CircleData";
import { VerticalBar } from "./graphs/BarChart";
import { DoughnutChart } from "./graphs/DoughnutChart";
import { HorizontalBar } from "./graphs/HorizontalBar";

const DashboardPage: FC = () => {
  const router = useRouter();
  const { userId, accessToken } = useAuth();

  // ------------------ Get all users infomaion ------------------
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken != null) {
        adminGetAllUserInfo_by_accessToken(accessToken)
          .then((data) => {
            // console.log(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
    fetchData();
  }, [accessToken]);

  const usageLastYear = UsageInThePastYear_for_CircleData(accessToken);
  const usageNextMonth = UsageInTheNextMonth_for_CircleData(accessToken);
  const totalAmountLastYear = TotalAmountByRoomOverThePastYear_for_Bar(accessToken);
  const totalMonthlyAmount = TotalAmountByMonthForThePastYear_Bar(accessToken);
  const totalAmountNextTwoMonths = TotalAmountForEachRoomTheNetTwoMonth_for_Bar(accessToken);

  return (
    <>
      <div className="bg-gray-200 p-5">
        <Header_by_AccessToken accessToken={accessToken} />

        <div className="flex flex-wrap w-full">
          <div className="w-[60%] p-2">
            <div className="bg-white h-full flex flex-col items-center justify-center  rounded-lg shadow">
              <p className="text-center font-bold text-sm">Monthly totals for the past year</p>
              <div className="w-[90%] h-[90%] overflow-auto">
                <VerticalBar data={totalMonthlyAmount} />
              </div>
            </div>
          </div>
          <div className="w-[40%] p-2">
            <div className="bg-white h-full flex flex-col items-center justify-center  rounded-lg shadow">
              <div className="w-[100%] h-[400px] overflow-auto mt-5">
                <p className="text-center font-bold text-sm">Usage of each rooms in last year</p>
                <DoughnutChart data={usageLastYear} />
              </div>
            </div>
          </div>
        </div>
        <div className="my-2 ml-2 w-[70%] h-full">
          <div className="bg-white flex flex-col items-center justify-center  rounded-lg shadow">
            <div className="w-[95%] h-[500px] overflow-auto mt-5">
              <p className="text-center font-bold text-sm"> Total amount by room over the past year</p>
              <HorizontalBar data={totalAmountLastYear} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full">
          <div className="w-[40%] p-2">
            <div className="bg-white h-full flex flex-col items-center justify-center  rounded-lg shadow">
              <div className="w-[100%] h-[400px] overflow-auto mt-5">
                <p className="text-center font-bold text-sm"> Usage over the next two months</p>
                <DoughnutChart data={usageNextMonth} />
              </div>
            </div>
          </div>
          <div className="w-[60%] p-2">
            <div className="bg-white h-full flex flex-col items-center justify-center  rounded-lg shadow">
              <p className="text-center font-bold text-sm">Total for each room for the next two months</p>
              <div className="w-[90%] h-[90%] overflow-auto">
                <VerticalBar data={totalAmountNextTwoMonths} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
