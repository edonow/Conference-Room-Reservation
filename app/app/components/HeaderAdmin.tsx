import { faCalendarXmark, faChartLine, faCircleChevronUp, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useLogout } from "../hooks/useLogout";

type HeaderProps = {
  accessToken: string | null;
};

const Header_by_AccessToken: FC<HeaderProps> = ({ accessToken }) => {
  const router = useRouter();
  const handleLogout = useLogout(accessToken);

  const handlePageBack = () => {
    router.back();
  };

  return (
    <div className="mx-2 bg-white h-full flex flex-col items-center justify-start rounded-lg shadow">
      <div className="flex items-center justify-between w-full gap-10 mx-5 py-4">
        <div className="flex gap-10 ml-5">
          <div className="border-b-2 border-yellow-300">
            <Link href="/top">
              <FontAwesomeIcon icon={faCircleChevronUp} className="text-2xl" />
              <span className="ml-2 text-xs font-bold ">Top</span>
            </Link>
          </div>
          <div className="border-b-2 border-yellow-300">
            <Link href="/dashboard">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl" />
              <span className="ml-2 text-xs font-bold ">Dashboad</span>
            </Link>
          </div>
          <div className="border-b-2 border-yellow-300">
            <Link href="/dashboard/userlist">
              <FontAwesomeIcon icon={faUserSecret} className="text-2xl" />
              <span className="ml-2 text-xs font-bold ">User List</span>
            </Link>
          </div>
          <div className="border-b-2 border-yellow-300">
            <Link href="/dashboard/reservationlist">
              <FontAwesomeIcon icon={faCalendarXmark} className="text-2xl" />
              <span className="ml-2 text-xs font-bold ">Reservation List</span>
            </Link>
          </div>
        </div>
        <div className="flex gap-5 mr-5">
          <button
            onClick={handlePageBack}
            className="text-xs font-bold px-2 py-1 border border-black rounded-3xl hover:border-yellow-300 hover:text-yellow-300 shadow"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-2 py-1 border border-black rounded-3xl hover:border-yellow-300 hover:text-yellow-300 shadow"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header_by_AccessToken;
