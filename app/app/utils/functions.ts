async function fetchData(url: string): Promise<any | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error:1. >> There was a problem with your fetch operation: " + error.message);
    } else {
      console.log("Error:2. >> There was a problem with your fetch operation: " + error);
    }
    throw error;
    // return null;
  }
}
// -------------------------------------------------------------
// USER
// -------------------------------------------------------------
export const createUser = async (
  firstName: string,
  lastName: string,
  organization: string,
  email: string,
  password: string
): Promise<any | null> => {
  const url = `/api/createUser?firstName=${firstName}&lastName=${lastName}&organization=${organization}&email=${email}&password=${password}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const loginUser = async (email: string, password: string): Promise<any | null> => {
  const url = `/api/loginUser?email=${email}&password=${password}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const logoutUser = async (token: string): Promise<any | null> => {
  const url = `/api/logoutUser?token=${token}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const getUserInfo_by_userId = async (userId: string): Promise<any | null> => {
  const url = `/api/getUserInfoByUserId?userId=${userId}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const getUserInfo_by_accessToken = async (token: string): Promise<any | null> => {
  const url = `/api/getUserInfoByAccessToken?token=${token}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const deleteUser_by_userId = async (userId: string): Promise<any | null> => {
  const url = `/api/deleteUserByUserId?userId=${userId}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const updateUserInfo_by_userId = async (
  userId: string,
  firstName: string,
  lastName: string,
  organization: string,
  email: string
): Promise<any | null> => {
  const url = `/api/updateUserInfoByUserId?userId=${userId}&firstName=${firstName}&lastName=${lastName}&organization=${organization}&email=${email}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const updateUserIsadmin_by_userId = async (userId: string, isAdmin: string): Promise<any | null> => {
  const url = `/api/updateUserIsadminByUserId?userId=${userId}&isAdmin=${isAdmin}`;

  return fetchData(url);
};

// -------------------------------------------------------------
// RESERVATION
// -------------------------------------------------------------
export const createReservation = async (
  room: string,
  date: string,
  start: number,
  end: number,
  number: number,
  price: number,
  user_id: string
): Promise<any | null> => {
  const url = `/api/createReservation?room=${room}&date=${date}&start=${start}&end=${end}&number=${number}&price=${price}&user_id=${user_id}`;

  return fetchData(url);
};

// -------------------------------------------------------------
export const getReservationInfoTheSameDate = async (date: string): Promise<any | null> => {
  const url = `/api/getReservationInfoTheSameDate?date=${date}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const getReservationData_by_userId = async (userId: string): Promise<any | null> => {
  const url = `/api/getReservationDataByUserId?userId=${userId}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const deleteReservation_by_reservatedId = async (reservatedId: string): Promise<any | null> => {
  const url = `/api/deleteReservation?reservatedId=${reservatedId}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const deleteReservation_by_userdId = async (userId: string): Promise<any | null> => {
  const url = `/api/deleteReservationUserHave?userId=${userId}`;

  return fetchData(url);
};
// -------------------------------------------------------------
// ADMIN
// -------------------------------------------------------------
export const adminGetAllUserInfo_by_accessToken = async (token: string): Promise<any | null> => {
  const url = `/api/adminGetAllUserInfo?token=${token}`;

  return fetchData(url);
};
// -------------------------------------------------------------
export const adminGetAllReservationnfo_by_accessToken = async (token: string): Promise<any | null> => {
  const url = `/api/adminGetAllReservationInfo?token=${token}`;

  return fetchData(url);
};
