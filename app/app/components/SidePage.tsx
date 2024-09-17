"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useLogout";
import {
  deleteReservation_by_reservatedId,
  getReservationData_by_userId,
  getUserInfo_by_userId,
  updateUserInfo_by_userId,
} from "../utils/functions";

type Reservation = {
  reserved_id: string;
  room: string;
  date: string;
  start: number;
  end: number;
  price: number;
  booked_at: string;
};

const SidePage: FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newOrganization, setNewOrganization] = useState(organization);
  const [newEmail, setNewEmail] = useState(email);

  const [reservationData, setReservationData] = useState<Reservation[]>([]);

  const router = useRouter();
  //  ----------------- Check access token -----------------
  const { userId, accessToken } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId != null) {
        try {
          const data = await getUserInfo_by_userId(userId);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setOrganization(data.organization);
          setEmail(data.email);
          setIsAdmin(data.is_admin);
        } catch (error) {
          console.error("Failed to fetch user info: ", error);
        }
      }
    };
    fetchUserInfo();
  }, [userId]);

  useEffect(() => {
    setNewFirstName(firstName);
    setNewLastName(lastName);
    setNewOrganization(organization);
    setNewEmail(email);
  }, [firstName, lastName, organization, email]);
  // ----------------- Logout -----------------
  const handleLogout = useLogout(accessToken);
  // ----------------- Update Edit user info -----------------
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleSaveClick = async () => {
    let isChanged = false;

    if (newFirstName && newFirstName !== firstName) {
      setFirstName(newFirstName);
      isChanged = true;
    }
    if (newLastName && newLastName !== lastName) {
      setLastName(newLastName);
      isChanged = true;
    }
    if (newOrganization && newOrganization !== organization) {
      setOrganization(newOrganization);
      isChanged = true;
    }
    if (newEmail && newEmail !== email) {
      setEmail(newEmail);
      isChanged = true;
    }

    setIsEditing(false);

    if (isChanged && userId != null) {
      try {
        await updateUserInfo_by_userId(userId, newFirstName, newLastName, newOrganization, newEmail);
      } catch (error) {
        console.error("Failed to update user info: ", error);
      }
    }
  };
  // ----------------- Get Revervation Data -----------------
  useEffect(() => {
    const fetchData = async () => {
      if (userId != null)
        getReservationData_by_userId(userId)
          .then((data) => {
            setReservationData(data);
          })
          .catch((error) => console.error("Failed to fetch reservation data: ", error));
    };
    fetchData();
  }, [userId]);
  const futureReservations = reservationData.filter((reservation) => {
    const reservationDate = new Date(reservation.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
  });
  // --------------- DELETE Reservation -----------------
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const openConfirmation = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setShowConfirmation(true);
  };

  const deleteReservation = async (reservedId: string) => {
    await deleteReservation_by_reservatedId(reservedId).then(() => window.location.reload());
  };
  // ----------------- Administor -----------------
  const handleAdminClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col justify-start items-end h-full bg-gray-200">
      <div className="bg-white rounded-xl w-full md:w-[85%] h-[300px] mt-5">
        <div className="flex justify-center flex-col w-full ">
          <div className="mt-5 mx-2 flex justify-between items-center">
            <p className="text-xs md:text-sm font-bold">
              <span className="border-b-2 border-yellow-300">User profile</span>
            </p>
            <p>
              <span
                className="text-xs hover:border-b-2 hover:border-yellow-300"
                onClick={isEditing ? handleSaveClick : handleEditClick}
              >
                {isEditing ? "Save ?" : "Edit ?"}
              </span>
            </p>
          </div>
          <div className="mt-8 ml-2 flex flex-col justify-center items-center">
            {isEditing ? (
              <>
                <label className="text-xs">
                  First Name:
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="px-2 border border-gray-500 rounded-lg text-base w-[90%]"
                  />
                </label>
                <label className="text-xs mt-3">
                  Last Name:
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="px-2 border border-gray-500 rounded-lg text-base w-[90%]"
                  />
                </label>
                <label className="text-xs mt-3">
                  Organization:
                  <input
                    type="text"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                    className="px-2 border border-gray-500 rounded-lg text-base w-[90%]"
                  />
                </label>
                <label className="text-xs mt-3">
                  Email:
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="px-2 border border-gray-500 rounded-lg text-base w-[90%]"
                  />
                </label>
              </>
            ) : (
              <>
                <p className="font-bold text-base md:text-2xl">
                  {firstName} {lastName}
                </p>
                <p className="mt-1 text-xs md:text-sm">{organization}</p>
                <p className="mt-4 font-bold text-xs md:text-base">{email}</p>
              </>
            )}
          </div>
          {isEditing ? (
            <></>
          ) : (
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleLogout}
                className="mt-4 px-2 py-1 w-[80%] border border-yellow-300 bg-yellow-300 text-xs md:text-sm font-bold rounded-3xl hover:border-yellow-200 hover:bg-yellow-200 shadow"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ------------------ Reservation List ------------------------ */}

      <div
        className="bg-white rounded-xl w-full md:w-[85%] mt-5"
        style={{
          height: futureReservations.length === 0 ? "160px" : `${futureReservations.length * 250 + 70}px`,
        }}
      >
        {/* 15x^2+35x-400 */}
        <div className="flex justify-center flex-col w-full ">
          <div className="mt-5 mx-2 flex justify-between items-center">
            <p className="text-xs md:text-sm font-bold">
              <span className="border-b-2 border-yellow-300">Your Reservations</span>
            </p>
          </div>
          <div className="mt-8 mx-2 flex flex-col items-start">
            {reservationData.length > 0 ? (
              reservationData
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((reservation, index) => {
                  const reservationDate = new Date(reservation.date);
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const now = new Date();
                  const threeHoursBeforeStart = new Date(reservation.date);
                  threeHoursBeforeStart.setHours(reservation.start - 3);
                  if (reservationDate > yesterday) {
                    return (
                      <div key={index}>
                        <div className={`text-xs ${index !== 0 ? "mt-5 border-t border-dashed pt-2" : ""}`}>
                          <div className="mx-2">
                            <p>Room:</p>
                            <p className="md:text-sm lg:text-base font-bold">{reservation.room}</p>
                            <p>Date:</p>
                            <p className="md:text-sm lg:text-base font-bold">{reservation.date}</p>
                            <p>Time:</p>
                            <p className="md:text-sm lg:text-base font-bold">
                              {reservation.start}:00 - {reservation.end}:00
                            </p>
                            <p>Price:</p>
                            <p className="md:text-sm lg:text-base font-bold">
                              ¥ {new Intl.NumberFormat("ja-JP").format(reservation.price)}
                            </p>
                          </div>
                        </div>

                        {now < threeHoursBeforeStart && (
                          <button
                            onClick={() => openConfirmation(reservation)}
                            className="mt-2 mx-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-100 hover:bg-red-200 shadow"
                          >
                            Delete
                          </button>
                        )}
                        {/* --------------- Confirmation form ------------------- */}
                        {showConfirmation && reservationToDelete && (
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
                                      <p className=" font-extrabold text-xl">{reservationToDelete.room}</p>
                                    </div>
                                    <div className="mb-4">
                                      <span className="block text-yellow-300 text-sm font-bold mb-2">日付:</span>
                                      <p className=" font-extrabold text-xl">{reservationToDelete.date}</p>
                                    </div>
                                    <div className="mb-4">
                                      <span className="block text-yellow-300 text-sm font-bold mb-2">時間:</span>
                                      <p className=" font-extrabold text-xl">
                                        {reservationToDelete.start}:00 - {reservationToDelete.end}:00
                                      </p>
                                    </div>
                                    {/* ... Cancel price code ... */}
                                    <div className="mb-4">
                                      <span className="block text-yellow-300 text-sm font-bold mb-2">
                                        キャンセル料金:
                                      </span>
                                      <p className=" font-extrabold text-xl">
                                        {(() => {
                                          const today = new Date();
                                          const reservationDate = new Date(reservationToDelete.date);
                                          const diffInDays = Math.ceil(
                                            (reservationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                                          );
                                          if (diffInDays >= 8 && diffInDays <= 14) {
                                            return `¥ ${new Intl.NumberFormat("ja-JP").format(reservation.price / 2)}`;
                                          } else if (diffInDays < 8) {
                                            return `¥ ${new Intl.NumberFormat("ja-JP").format(reservation.price)}`;
                                          } else {
                                            return "¥  0";
                                          }
                                        })()}
                                      </p>
                                    </div>
                                    {/* ... Cancel price code ... */}
                                    <div className="flex items-center justify-center gap-4">
                                      <button
                                        className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-1 px-4 w-1/2 rounded-lg "
                                        onClick={() => deleteReservation(reservationToDelete.reserved_id)}
                                      >
                                        YES
                                      </button>
                                      <button
                                        className="hover:bg-gray-100 border border-black text-black font-bold py-1 px-4 w-1/2 rounded-lg"
                                        onClick={() => setShowConfirmation(false)}
                                      >
                                        NO
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })
            ) : (
              <p className="font-bold">No Reservation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SidePage;
