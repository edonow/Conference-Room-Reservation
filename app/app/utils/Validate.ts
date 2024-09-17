export function validatePassword(password: string): string | null {
  if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
    return "Password must be at least 8 characters and contain at least one number (0 - 9), capital letter (A, ..., Z)";
  }
  // if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
  //   return "Password must be at least 8 characters and contain at least one number (0 - 9), capital letter (A, ..., Z), and symbol (!@#$%^&*)";
  // }
  return null;
}

export function validateEmail(email: string): string | null {
  if (email === null || email === "" || !/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid Email ( ex. example@****.*** )";
  }
  return null;
}

// ------------- Check Available Room -------------
interface Reservation {
  room: string;
  start: number;
  end: number;
}

interface TimeZone {
  start: number;
  end: number;
}
export function isRoomReserved(reservation: Reservation, roomName: string | null, timeZone: TimeZone): boolean {
  return (
    (reservation.room === roomName ||
      (reservation.room === "プレゼンテーションルーム" &&
        (roomName === "プレゼンテーションルームA" || roomName === "プレゼンテーションルームB")) ||
      ((reservation.room === "プレゼンテーションルームA" || reservation.room === "プレゼンテーションルームB") &&
        roomName === "プレゼンテーションルーム")) &&
    ((reservation.start <= timeZone.start && timeZone.start <= reservation.end) ||
      (reservation.start <= timeZone.end && timeZone.end <= reservation.end))
  );
}
