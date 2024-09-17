"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { FC, useEffect, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { eachRooms, roomsInfo } from "../data/roomData";
import CheckPriceId from "../utils/CheckPriceId";
import { isRoomReserved } from "../utils/Validate";
import { createReservation, getReservationInfoTheSameDate } from "../utils/functions";
import Room from "./Room";
import { TopPageImage } from "./TopPageImage";
export const PresentationAB = [
  "/images/presentation_room_ab_1.webp",
  "/images/presentation_room_ab_2.webp",
  "/images/presentation_room_ab_3.webp",
];
export const PresentationA = [
  "/images/presentation_room_a_1.webp",
  "/images/presentation_room_a_2.webp",
  "/images/presentation_room_a_3.webp",
];
export const PresentationB = [
  "/images/presentation_room_b_1.webp",
  "/images/presentation_room_b_2.webp",
  "/images/presentation_room_b_3.webp",
];
export const Training = [
  "/images/training_room_1.webp",
  "/images/training_room_2.webp",
  "/images/training_room_3.webp",
];
export const Meeting = ["/images/meeting_room_1.webp", "/images/meeting_room_2.webp", "/images/meeting_room_3.webp"];

type ReservationValue = {
  room: string;
  date: string;
  start: number;
  end: number;
  number: number;
  price: number;
};

type Reservation = {
  reserved_id: string;
  room: string;
  date: string;
  start: number;
  end: number;
  booked_at: string;
};

const ReservationPage: FC = () => {
  const [roomSelection, setRoomSelection] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [reservetionValue, setReservetionValue] = useState<ReservationValue | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [rooms, setRooms] = useState(eachRooms);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // ------- images --------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const openModal = (room: string, images: string[]) => {
    setCurrentRoom(room);
    setIsOpen(true);
    setCurrentImages(images);
  };
  const closeModal = () => {
    setIsOpen(false);
    setCurrentRoom(null);
  }; // モーダルを閉じるときに現在の部屋をリセット
  //-------------------------------------------------------

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let errorFound = false;
      eachRooms.forEach((room) => {
        if (room.name === roomSelection && room.capacity < participants) {
          setError(
            `選択された部屋の容量は${room.capacity}人です。入力された利用者数は${participants}人で、部屋の容量を超えています。`
          );
          errorFound = true;
        }
      });
      if (!errorFound) {
        setError("");
      }
    };
    fetchData();
  }, [participants, roomSelection]);

  async function updateRoomAvailability() {
    let roomsCopy = JSON.parse(JSON.stringify(rooms)); // Create a deep copy of rooms

    for (let room of roomsCopy) {
      for (let timeZone of room.timeZones) {
        timeZone.isRoom = false;
      }
    }

    if (selectedDate) {
      const reservations: Reservation[] = await getReservationInfoTheSameDate(selectedDate);

      for (let room of roomsCopy) {
        for (let timeZone of room.timeZones) {
          let isReserved: boolean = false;
          for (let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i];
            if (isRoomReserved(reservation, room.name, timeZone)) {
              isReserved = true;
              break;
            }
          }
          timeZone.isRoom = isReserved;
        }
      }
    }

    setRooms(roomsCopy); // Update the state with the modified copy
  }

  useEffect(() => {
    async function fetchDataAndUpdateAvailability() {
      if (selectedDate) {
        const data = await getReservationInfoTheSameDate(selectedDate);
        await updateRoomAvailability();
      }
    }
    fetchDataAndUpdateAvailability();
  }, [selectedDate]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 0);
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.startStr);
  };
  // -------------------------------------------------------
  const openConfirmation = () => {
    const fetchPriceId = async () => {
      if (reservetionValue && reservetionValue.room && reservetionValue.start && reservetionValue.end) {
        const id = await CheckPriceId(reservetionValue.room, reservetionValue.start, reservetionValue.end);
        setPriceId(id);
      }
    };
    fetchPriceId();
    localStorage.setItem("reservetionValue", JSON.stringify(reservetionValue));
    setShowConfirmation(true);
  };
  // -------------------------------------------------------
  //  Stripe PAYMENT
  // -------------------------------------------------------
  const [price_id, setPriceId] = useState<string | undefined>();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
  const query = new URLSearchParams(window.location.search);
  useEffect(() => {
    const storedReservetionValueString = localStorage.getItem("reservetionValue");
    if (storedReservetionValueString !== null) {
      const storedReservetionValue = JSON.parse(storedReservetionValueString);
      setReservetionValue(storedReservetionValue);
      localStorage.removeItem("reservetionValue");
    }
    // -------------------------------------------------------
    // FINAL CONFIRMATION
    // -------------------------------------------------------
    const confirmReservation = async () => {
      if (reservetionValue) {
        setIsSending(true);

        const { room, date, start, end, number, price } = reservetionValue;
        const user_id = userId;

        if (room && date && start && end && price && user_id) {
          await createReservation(room, date, start, end, number, price, user_id);
          console.log(" >> create reservation:");
          window.history.pushState({}, "", "/top");
          window.location.reload();
        } else {
          console.log("Reservation values are not complete");
        }

        setIsSending(false);
        setShowConfirmation(false);
      }
    };

    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
      confirmReservation();
    }

    if (query.get("canceled")) {
      console.log("Order canceled -- continue to shop around and checkout when you’re ready.");
      window.history.pushState({}, "", "/top");
      window.location.reload();
    }
  }, [reservetionValue]);

  // -------------------------------------------------------

  return (
    <>
      <div className="bg-gray-200 h-full">
        <div className="flex flex-col items-center justify-center">
          {/* ------------------ TOP IMAGE ----------------------------- */}
          <TopPageImage title="Would You Prefer ?"></TopPageImage>
          {/* ---------------------------------------------------------- */}
          <div></div>
          <div className="border-2 my-4 p-4 bg-white w-11/12 shadow-lg rounded-lg">
            <div className="flex justify-around gap-2">
              <Room
                name="プレゼンテーションルーム"
                images={PresentationAB}
                isOpen={isOpen}
                currentRoom={currentRoom}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={false}
              />
              <Room
                name="プレゼンテーションルームA"
                images={PresentationA}
                isOpen={isOpen}
                currentRoom={currentRoom}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={false}
              />
              <Room
                name="プレゼンテーションルームB"
                images={PresentationB}
                isOpen={isOpen}
                currentRoom={currentRoom}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={false}
              />
              <Room
                name="研修室"
                images={Training}
                isOpen={isOpen}
                currentRoom={currentRoom}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={false}
              />
              <Room
                name="ミーティングルーム"
                images={Meeting}
                isOpen={isOpen}
                currentRoom={currentRoom}
                openModal={openModal}
                closeModal={closeModal}
                isAdmin={false}
              />
            </div>
          </div>
          <div></div>
          <div className="border-2 my-4 p-4 bg-white w-11/12  shadow-lg rounded-lg">
            {/* ------------------ SELECT ROOM ----------------------------- */}
            <h2 className="mt-4 font-black px-4 py-2 border-b-2 border-yellow-300">SPACE | 2階 (2nd floor)</h2>
            <div className="my-4 flex flex-col lg:flex-row gap-3 justify-center">
              {roomsInfo.slice(0, 5).map((room, index) => (
                <div
                  key={index}
                  className={`text-sm border-2 border-gray-300 px-4 py-2 rounded-3xl w-full lg:w-1/5 h-40 flex flex-col justify-around items-center cursor-pointer hover:border-yellow-400 transition-colors duration-200 shadow ${
                    room.name === roomSelection ? "bg-yellow-300 border-yellow-300" : ""
                  }`}
                  onClick={() => setRoomSelection(room.name)}
                >
                  <h2 className="font-bold text-base">{room.name}</h2>
                  <p className="text-gray-600">{room.capacity}名</p>
                  <p className="text-gray-600">{room.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-10"></div>
            {/* ---------------------- INPUT Number of participants  ------------------------- */}
            <div className="mt-10 mb-10 mx-2 flex flex-col justify-start items-start">
              <div className="border-2 border-gray-200 rounded-xl p-4 shadow">
                <label className="mr-2 font-bold border-b-2 border-yellow-300">利用人数:</label>
                <input
                  type="text"
                  onBlur={(e) => setParticipants(Number(e.target.value))}
                  className="ml-3 border-2 rounded-lg w-10 text-center hover:border-yellow-400 shadow"
                />
              </div>
              {error && <div className="mt-2 text-red-500">{error}</div>}
            </div>
            <div className="mt-32"></div>
            {/* ------------------ FULL CALENDAR ----------------------------- */}
            {roomSelection && participants != 0 && error === "" && (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                validRange={{
                  start: startDate,
                  end: twoMonthsLater,
                }}
                selectable={true}
                select={handleDateSelect}
                height={500}
                dayCellContent={(renderInfo) => {
                  const date = renderInfo.date;

                  const isSecondSunday = date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 1;

                  const isYearEndNewYear =
                    (date.getMonth() === 11 && date.getDate() >= 29) || (date.getMonth() === 0 && date.getDate() <= 3);
                  if (isSecondSunday || isYearEndNewYear) {
                    return (
                      <div>
                        {renderInfo.dayNumberText}
                        <br />
                        close
                      </div>
                    );
                  } else {
                    return renderInfo.dayNumberText;
                  }
                }}
                dayCellDidMount={(cellInfo) => {
                  const date = cellInfo.date;
                  const isSecondSunday = date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 1;
                  const isYearEndNewYear =
                    (date.getMonth() === 11 && date.getDate() >= 29) || (date.getMonth() === 0 && date.getDate() <= 3);
                  if (isSecondSunday || isYearEndNewYear) {
                    cellInfo.el.classList.add("bg-gray-200", "no-hover");
                  }
                }}
                datesSet={(dateInfo) => {
                  const cells = document.querySelectorAll(".fc-daygrid-day");
                  cells.forEach((cell) => {
                    const dateAttr = cell.getAttribute("data-date");
                    if (dateAttr) {
                      const date = new Date(dateAttr);
                      if (date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 1) {
                        cell.classList.add("bg-gray-200", "no-hover");
                      }
                      if (
                        (date.getMonth() === 11 && date.getDate() >= 29) ||
                        (date.getMonth() === 0 && date.getDate() <= 3)
                      ) {
                        cell.classList.add("bg-gray-200", "no-hover");
                      }
                    }
                  });
                }}
                selectAllow={(selectInfo) => {
                  const date = new Date(selectInfo.startStr);
                  const isSecondSunday = date.getDay() === 0 && Math.floor((date.getDate() - 1) / 7) === 1;
                  const isYearEndNewYear =
                    (date.getMonth() === 11 && date.getDate() >= 29) || (date.getMonth() === 0 && date.getDate() <= 3);
                  return !(isSecondSunday || isYearEndNewYear);
                }}
              />
            )}
            {/* ------------------ SELECT TIME ----------------------------- */}
            {selectedDate && roomSelection && (
              <div className="mt-20 flex flex-wrap justify-left gap-3">
                {rooms
                  .find((room) => room.name === roomSelection)
                  ?.timeZones.map((timeZone, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg w-full sm:w-1/5 h-28 text-center hover:border-yellow-400  flex flex-col justify-center gap-2 shadow ${
                        reservetionValue &&
                        timeZone.start === reservetionValue.start &&
                        timeZone.end === reservetionValue.end
                          ? "bg-yellow-300 boder-yellow-300"
                          : ""
                      }`}
                      onClick={() => {
                        if (!timeZone.isRoom) {
                          setReservetionValue({
                            room: roomSelection,
                            date: selectedDate,
                            start: timeZone.start,
                            end: timeZone.end,
                            number: participants,
                            price: timeZone.price,
                          });
                        }
                      }}
                    >
                      <p>{timeZone.time}</p>
                      <p>¥{new Intl.NumberFormat("ja-JP").format(timeZone.price)}</p>
                      {timeZone.isRoom ? (
                        <p className="text-red-500 font-bold">×</p>
                      ) : (
                        <p className="text-yellow-500 font-bold">◯</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {/* ---------------------- BOOKING BUTTON ------------------------- */}
            {reservetionValue && (
              <div className="mt-20 mb-10 flex justify-center">
                <button
                  className="px-6 py-2 border-2 border-yellow-300 bg-yellow-300 rounded-3xl text-base font-bold shadow"
                  onClick={openConfirmation}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "予約 / Book"}
                </button>
              </div>
            )}
            {/* ---------------------- Final confirmation screen ------------------------- */}
            {showConfirmation && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white rounded-xl w-[500px]">
                  <div className="p-4 rounded-xl m-4">
                    <p className="mb-2 font-bold text-2xl text-black border-b-2 border-yellow-300">
                      Confirm Your Reservation?
                    </p>
                    <div className="leading-8">
                      <div className="px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="mb-4">
                          <span className="block text-yellow-300 text-sm font-bold mb-2">部屋:</span>
                          <p className=" font-extrabold text-xl">{reservetionValue?.room}</p>
                          <p className="text-sm font-bold">(利用人数：{reservetionValue?.number}人)</p>
                        </div>
                        <div className="mb-4">
                          <span className="block text-yellow-300 text-sm font-bold mb-2">日付:</span>
                          <p className=" font-extrabold text-xl">{reservetionValue?.date}</p>
                        </div>
                        <div className="mb-4">
                          <span className="block text-yellow-300 text-sm font-bold mb-2">時間:</span>
                          <p className=" font-extrabold text-xl">
                            {reservetionValue?.start}:00 - {reservetionValue?.end}:00
                          </p>
                        </div>
                        <div className="mb-4">
                          <span className="block text-yellow-300 text-sm font-bold mb-2">料金:</span>
                          <p className=" font-extrabold text-xl">
                            ¥
                            {reservetionValue?.price
                              ? new Intl.NumberFormat("ja-JP").format(reservetionValue.price)
                              : "0"}
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                          <form
                            action="/api/checkout_sessions"
                            method="POST"
                            className="grid text-center bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-1 px-4 w-1/2 rounded-lg shadow"
                          >
                            <input type="hidden" name="price_id" value={price_id} />
                            <button type="submit" role="link">
                              YES
                            </button>
                          </form>
                          <button
                            className="hover:bg-gray-100 border border-black text-black font-bold py-1 px-4 w-1/2 rounded-lg shadow"
                            onClick={() => setShowConfirmation(false)}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 leading-6">
                        <p className="font-bold text-red-400">キャンセル料金は2週間前から発生します。</p>
                        <nav>
                          <li>
                            利用日の14〜8日前のキャンセル： ¥
                            {reservetionValue?.price
                              ? new Intl.NumberFormat("ja-JP").format(reservetionValue.price / 2)
                              : "0"}
                          </li>
                          <li>
                            利用日の7日前〜のキャンセル： ¥
                            {reservetionValue?.price
                              ? new Intl.NumberFormat("ja-JP").format(reservetionValue.price)
                              : "0"}
                          </li>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* -------------------------------------------------------------- */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationPage;
