"use client";

import Header_by_AccessToken from "@/app/components/HeaderAdmin";
import ReservationByAdminForGuest from "@/app/components/ReservationByAdminForGuest";
import { useAuth } from "@/app/hooks/useAuth";
import {
  adminGetAllReservationnfo_by_accessToken,
  deleteReservation_by_reservatedId,
  getUserInfo_by_userId,
} from "@/app/utils/functions";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { FC, useEffect, useState } from "react";
import "./style.css";

type ReservationData = {
  reserved_id: string;
  room: string;
  date: string;
  start: number;
  end: number;
  number: number;
  price: number;
  user_id: string;
  booked_at: string;
};
function formatTime(time: number) {
  return `${time.toString().padStart(2, "0")}`;
}
function shortenRoomName(room: string) {
  if (room === "プレゼンテーションルーム") return "プレ全";
  if (room === "プレゼンテーションルームA") return "プレA";
  if (room === "プレゼンテーションルームB") return "プレB";
  if (room === "研修室") return "研修室";
  if (room === "ミーティングルーム") return "ミーティング";
  if (room === "インキュベートルーム") return "Incubate";
  return room;
}
function renderEventContent(eventInfo: { event: { backgroundColor: string; title: string } }) {
  return {
    html: `<div style="background-color: ${eventInfo.event.backgroundColor}; border-radius: 12px; padding: 0.7px 1.2px;">${eventInfo.event.title}</div>`,
  };
}
function getUserName(user_id: string) {
  return getUserInfo_by_userId(user_id).then((data) => {
    return `${data.firstName} ${data.lastName}`;
  });
}
function getUserOrganization(user_id: string) {
  return getUserInfo_by_userId(user_id).then((data) => {
    return data.organization;
  });
}

// ------------------------------------------
const ReservationList: FC = () => {
  const { userId, accessToken } = useAuth();
  const [reservationData, setReservationData] = useState([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken !== null) {
        await adminGetAllReservationnfo_by_accessToken(accessToken)
          .then((data) => {
            const now = new Date();
            const futureReservations = data.filter((reservation: ReservationData) => {
              const reservationDate = new Date(reservation.date);
              return reservationDate >= now;
            });
            //  Sort by start time
            const sortedReservations = futureReservations.sort((a: ReservationData, b: ReservationData) => {
              const dateA = new Date(a.start);
              const dateB = new Date(b.start);
              return dateA.getTime() - dateB.getTime();
            });

            const events = futureReservations.map((reservation: ReservationData) => {
              let bgColor;
              if (reservation.room === "プレゼンテーションルーム") bgColor = "rgba(255, 99, 132, 0.4)";
              else if (reservation.room === "プレゼンテーションルームA") bgColor = "rgba(54, 162, 235, 0.4)";
              else if (reservation.room === "プレゼンテーションルームB") bgColor = "rgba(255, 206, 86, 0.4)";
              else if (reservation.room === "研修室") bgColor = "rgba(75, 192, 192, 0.4)";
              else if (reservation.room === "ミーティングルーム") bgColor = "rgba(153, 102, 255, 0.4)";
              else if (reservation.room === "インキュベートルーム") bgColor = "rgba(255, 255, 0, 0.4)";

              return {
                title: `${shortenRoomName(reservation.room)} (${formatTime(reservation.start)}-${formatTime(
                  reservation.end
                )})`,
                start: `${reservation.date}T${formatTime(reservation.start)}:00`,
                end: `${reservation.date}T${formatTime(reservation.end)}:00`,
                backgroundColor: bgColor,
                borderColor: bgColor,
                textColor: "black",
                extendedProps: reservation, // 予約データを設定
              };
            });

            setReservationData(events);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    };
    fetchData();
  }, [accessToken]);
  // ----------- GET Reserved User Information ------------
  useEffect(() => {
    if (userId !== null) {
      getUserName(userId).then(setUserName);
      getUserOrganization(userId).then(setOrganization);
    }
  }, [userId]);
  //------------ Setting modal ------------
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ReservationData | null>(null);

  function handleEventClick(clickInfo: EventClickArg) {
    const reservationData = clickInfo.event.extendedProps as ReservationData; // TypeScriptの型アサーションを使用
    setSelectedEvent(reservationData);
    setModalVisible(true);
  }
  function handleModalClose() {
    setModalVisible(false);
  }

  const info = [
    { label: "Name", value: userName },
    { label: "Organization", value: organization },
    { label: "Room", value: selectedEvent?.room },
    { label: "Date", value: selectedEvent?.date },
    { label: "Start - end", value: `${selectedEvent?.start}:00 - ${selectedEvent?.end}:00` },
    { label: "Price", value: `¥ ${new Intl.NumberFormat("ja-JP").format(selectedEvent?.price || 0)}` },
  ];

  function handleDelet(reservationId: string | null | undefined) {
    console.log("Delete reservationId:", reservationId);
    if (reservationId) {
      deleteReservation_by_reservatedId(reservationId);
    }
    setModalVisible(false);
    window.location.reload();
  }
  return (
    <>
      <div className="bg-gray-200 p-5">
        <Header_by_AccessToken accessToken={accessToken} />

        <div className="mt-5 flex flex-wrap w-full">
          <div className="w-full h-full p-2">
            <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow overflow-auto">
              <ReservationByAdminForGuest />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap w-full">
          <div className="w-full h-screen p-2">
            <div className="bg-white flex flex-col items-center justify-center rounded-lg shadow overflow-auto">
              <p className="my-5 text-base sm:text-2xl font-bold">Reservation List</p>
              <div className="w-[95%] h-[calc(100%-2rem)] mt-5 mb-10">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={reservationData}
                  displayEventTime={false}
                  eventContent={renderEventContent}
                  eventClick={handleEventClick}
                  eventClassNames="myCustomEventTitle"
                />
                {modalVisible && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10"
                    onClick={handleModalClose}
                  >
                    <div
                      className="bg-white w-[80%] sm:w-[70%] md:w-[50%] lg:w-[40%] h-[80%] sm:h-[65%]  rounded-3xl overflow-auto shadow p-5"
                      onClick={(event) => {
                        event.stopPropagation(); // イベントの伝播を停止
                      }}
                    >
                      <div className="mx-5">
                        {info.map((item, index) => (
                          <div key={index} className="my-5">
                            <p className="text-sm text-gray-500">
                              <span className="border-b-2 border-yellow-300">{item.label}:</span>
                            </p>
                            <p className="mt-2 text-base sm:text-xl lg:text-xl font-bold text-black">{item.value}</p>
                          </div>
                        ))}
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleDelet(selectedEvent?.reserved_id || null)}
                            className="mt-2 mx-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-100 border-red-100  hover:bg-red-200 shadow"
                          >
                            {" "}
                            Delete
                          </button>
                          <button
                            onClick={handleModalClose}
                            className="mt-2 mx-1 px-2 py-1 rounded-lg text-xs font-bold  border border-black hover:border-gray-300 hover:text-gray-300"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReservationList;
