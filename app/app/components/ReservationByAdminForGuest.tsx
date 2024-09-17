"use client";

import { FC, useEffect, useState } from "react";
import { eachRooms, roomsInfo } from "../data/roomData";
import { useAuth } from "../hooks/useAuth";
import { isRoomReserved, validateEmail, validatePassword } from "../utils/Validate";
import { createReservation, createUser, getReservationInfoTheSameDate } from "../utils/functions";

type TimeZone = {
  time: string;
  start: number;
  end: number;
  price: number;
  isRoom?: boolean;
};

type Reservation = {
  room: string;
  date: string;
  start: number;
  end: number;
  number: number;
  price: number;
};

const ReservationByAdminForGuest: FC = () => {
  const { userId, accessToken } = useAuth();
  const [roomSelection, setRoomSelection] = useState<string | null>(null);
  const [dateSelection, setDateSelection] = useState<string | null>(null);
  const [availableTime, setAvailableTime] = useState<TimeZone[]>([]);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [timeSelection, setTimeSelection] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [reservationData, setReservationData] = useState<Reservation | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [guestUserId, setGuestUserId] = useState<string | null>(null);

  // Open and close the modal window---------------------
  const openModal = () => {
    updateReservationData();
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // ----- Reset the state when the room is changed -----
  useEffect(() => {
    setNumberOfPeople(null);
    setDateSelection(null);
    setTimeSelection("");
    setAvailableTime([]);
  }, [roomSelection]);

  useEffect(() => {
    const fetchData = async () => {
      if (dateSelection) {
        await getReservationInfoTheSameDate(dateSelection)
          .then((data: Reservation[]) => {
            const selectedRoom = eachRooms.find((room) => room.name === roomSelection);
            if (selectedRoom) {
              const availableTimeZones = selectedRoom.timeZones.filter((timeZone) => {
                if (roomSelection) {
                  return !data.some((reservation) => isRoomReserved(reservation, roomSelection, timeZone));
                }
              });
              setAvailableTime(availableTimeZones);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    fetchData();
  }, [roomSelection, dateSelection]);

  // Calculate the price of the reservation---------------
  const updateReservationData = () => {
    if (roomSelection && dateSelection && timeSelection && numberOfPeople) {
      const selectedRoom = eachRooms.find((room) => room.name === roomSelection);
      if (selectedRoom) {
        const selectedTimeZone = selectedRoom.timeZones.find((timeZone) => timeZone.time === timeSelection);
        if (selectedTimeZone) {
          setReservationData({
            room: roomSelection,
            date: dateSelection,
            start: selectedTimeZone.start,
            end: selectedTimeZone.end,
            number: numberOfPeople,
            price: selectedTimeZone.price,
          });
        }
      }
    }
  };

  useEffect(updateReservationData, [roomSelection, dateSelection, timeSelection, numberOfPeople]);

  // Create a reservation when the guest user is registered-----
  useEffect(() => {
    if (reservationData && guestUserId) {
      createReservation(
        reservationData.room,
        reservationData.date,
        reservationData.start,
        reservationData.end,
        reservationData.number,
        reservationData.price,
        guestUserId
      );
    }
  }, [guestUserId, reservationData]);

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    createUser(firstName, lastName, organization, email, password)
      .then((data) => {
        setGuestUserId(data.user.user_id);
      })
      .catch((error) => console.error(error));

    closeModal();
    window.location.reload();
  };
  // ------ Reset the password when the password is invalid ------
  useEffect(() => {
    if (passwordError) {
      setPassword("");
    }
  }, [passwordError]);
  // --------------------------------------------------------------
  return (
    <div className="flex flex-col items-center">
      <p className="mt-4 mb-2 font-black px-4 pt-2 border-b-2 border-yellow-300">RESERVATION FOR GUEST</p>
      <div className="my-4 flex flex-col sm:flex-row gap-3 justify-center w-[90%]">
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

      <div className="my-4 flex justify-between w-[90%] gap-5">
        <div className="mt-4 w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numOfPeople">
            利用人数
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numOfPeople"
            type="number"
            placeholder="人数を入力"
            value={numberOfPeople || ""}
            onChange={(e) => {
              const selectedRoom = roomsInfo.find((room) => room.name === roomSelection);
              if (selectedRoom && parseInt(e.target.value) > selectedRoom.capacity) {
                setErrorMessage("選択した部屋の定員を超えています");
                e.target.value = "";
              } else {
                setErrorMessage("");
                setNumberOfPeople(parseInt(e.target.value));
              }
            }}
          />
          {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
        </div>

        <div className="mt-4 w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            利用日時
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={dateSelection || ""}
            min={new Date().toISOString().split("T")[0]}
            max={new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0]}
            onChange={(e) => setDateSelection(e.target.value)}
          />
        </div>

        <div className="mt-4 w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
            利用時間帯
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="time"
            value={timeSelection}
            onChange={(e) => setTimeSelection(e.target.value)}
          >
            {availableTime.length === 0 ? (
              <option value="default">選択できる時間帯はありません</option>
            ) : (
              <option value="default">時間帯を選択ください</option>
            )}
            {availableTime.map((timeZone, index) => (
              <option key={index} value={timeZone.time}>
                {timeZone.time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {numberOfPeople && dateSelection && timeSelection && roomSelection && (
        <div className="my-5">
          <div className="flex flex-col justify-center">
            <p className="mt-4 font-bold">{reservationData && `利用金額: ¥ ${reservationData.price}`}</p>
            <button
              className="mt-4 bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-1 px-4 rounded-xl shadow"
              onClick={() => {
                updateReservationData();
                openModal();
              }}
            >
              Book
            </button>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
          onClick={closeModal}
        >
          <div
            className="bg-white w-[40%] h-[60%] p-5 rounded-lg"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <form className="flex flex-col space-y-4" onSubmit={handleRegistration}>
              <label className="flex flex-col text-sm text-gray-500">
                First Name:
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 p-2 border rounded"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-500">
                Last Name:
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 p-2 border rounded"
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-gray-500">
                Organization:
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="mt-1 p-2 border rounded"
                />
              </label>
              <label className="flex flex-col text-sm text-gray-500">
                E-mail:
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-2 border rounded"
                  required
                />
                {emailError && (
                  <div className="w-[90%]">
                    <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
                  </div>
                )}
              </label>
              <label className="flex flex-col text-sm text-gray-500">
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 border rounded"
                  required
                />
              </label>
              {passwordError && (
                <div className="w-[90%]">
                  <p className="text-red-500 text-xs mt-1 text-left">{passwordError}</p>
                </div>
              )}
              <div className="flex justify-end mt-5 text-xs">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 font-bold rounded-xl bg-gray-300 hover:bg-gray-400 shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 font-bold rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 shadow"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReservationByAdminForGuest;
