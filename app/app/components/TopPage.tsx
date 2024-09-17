import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const TopPage: FC = () => {
  return (
    <>
      <div className="bg-gray-200 min-h-screen">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="border-2 my-4 p-4 bg-white w-11/12 h-[1000px] sm:h-[600px] shadow-lg rounded-lg flex flex-col items-center justify-center">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="ml-3 text-left pr-4 w-full sm:w-[60%]">
                <p className="mt-20 sm:mt-0 mb-5 text-sm font-bold border-b-2 border-yellow-300">
                  Conference Room Reservations Website
                </p>
                <p className="text-2xl font-bold">WELCOME!</p>
                <p className="text-2xl font-bold">This is Web Reservation</p>
                <div className="mt-3 text-sm">
                  <p>
                    A dummy website is a website that is created for testing purposes. It is used to simulate the
                    functionality and design of a website without the need for actual content.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-[40%]">
                <Image src="/images/top.png" alt="hero" width={400} height={400} priority />
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/top"
                className="mx-4 px-4 py-2 border border-black rounded-3xl bg-white hover:bg-yellow-300 self-center mt-4 shadow"
              >
                Book me →
              </Link>
              <Link href="/about" className="mx-8 hover:border-b-2 hover:border-black self-center mt-4">
                See our services →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TopPage;
