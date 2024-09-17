"use client";

import Header_by_AccessToken from "@/app/components/HeaderAdmin";
import { useAuth } from "@/app/hooks/useAuth";
import {
  adminGetAllUserInfo_by_accessToken,
  deleteReservation_by_userdId,
  deleteUser_by_userId,
  updateUserIsadmin_by_userId,
} from "@/app/utils/functions";
import { faArrowDownShortWide, faArrowUpWideShort, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useState } from "react";

type UesrData = {
  user_id: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  is_admin: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

const UserList: FC = () => {
  const { userId, accessToken } = useAuth();
  const [users, setUsers] = useState<UesrData[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  //----------- sort -----------------
  const handleSort = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };
  //----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        await adminGetAllUserInfo_by_accessToken(accessToken)
          .then((data) => {
            setUsers(data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    fetchData();
  }, [accessToken]);

  function handleDeleteUser(user_id: string) {
    if (userId) {
      deleteReservation_by_userdId(user_id);
      deleteUser_by_userId(user_id);
      window.location.reload();
    }
  }
  function hadleChageAdminStatus(user_id: string, isAdmin: boolean) {
    if (isAdmin === true) {
      updateUserIsadmin_by_userId(user_id, "false");
    } else {
      updateUserIsadmin_by_userId(user_id, "true");
    }
    window.location.reload();
  }

  return (
    <>
      <div className="bg-gray-200 p-5">
        <Header_by_AccessToken accessToken={accessToken} />

        <div className="flex flex-wrap w-full">
          <div className="w-full h-screen p-2">
            <div className="bg-white h-full flex flex-col items-center justify-center rounded-lg shadow">
              <h1 className="text-lg font-bold mb-4">User List</h1>
              <div className="w-[90%] overflow-auto mx-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Admin Status
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <p>
                          Created Day
                          <span className="text-[8px]">( yyyy/mm/dd )</span>
                        </p>
                        <button onClick={handleSort} className="text-[10px]">
                          {sortOrder === "asc" ? (
                            <p>
                              <FontAwesomeIcon icon={faArrowUpWideShort} />
                              <span className="ml-1">Sort</span>
                            </p>
                          ) : (
                            <p>
                              <FontAwesomeIcon icon={faArrowDownShortWide} />
                              <span className="ml-1">Sort</span>
                            </p>
                          )}
                        </button>
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <FontAwesomeIcon icon={faTrash} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => user.user_id !== userId)
                      .sort((a, b) => {
                        const comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                        return sortOrder === "asc" ? comparison : -comparison;
                      })
                      .map((user, index) => (
                        <tr key={index}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.organization}</td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">
                            {user.is_admin ? "Yes" : "No"}
                            <button
                              className="ml-2 text-[10px] text-white font-medium "
                              onClick={() => hadleChageAdminStatus(user.user_id, user.is_admin)}
                            >
                              {user.is_admin ? (
                                <span className="bg-red-200 hover:bg-red-400 rounded-xl px-2 py-[2px]"> → No</span>
                              ) : (
                                <span className="bg-green-200 hover:bg-green-400 rounded-xl px-2 py-[2px]">
                                  → Administrator?
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">
                            {new Date(user.created_at).getFullYear()}/
                            {("0" + (new Date(user.created_at).getMonth() + 1)).slice(-2)}/
                            {("0" + new Date(user.created_at).getDate()).slice(-2)}
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">
                            <button
                              className="bg-red-200 hover:bg-red-400 text-white text-xs font-bold py-1 px-2 rounded"
                              onClick={() => handleDeleteUser(user.user_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserList;
