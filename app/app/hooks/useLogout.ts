import { useRouter } from "next/navigation";
import { logoutUser } from "../utils/functions";

export const useLogout = (accessToken: string | null) => {
  const router = useRouter();

  const handleLogout = () => {
    if (accessToken != null) logoutUser(accessToken);
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    router.push("/");
  };

  return handleLogout;
};
