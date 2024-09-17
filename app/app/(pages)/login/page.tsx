import { FC } from "react";
import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";

// LoginPage.tsx
const LoginPage: FC = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="flex w-3/4">
          <div className="relative flex justify-center items-center bg-white w-1/2 h-[600px] rounded-l-lg shadow text-center">
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <p className="font-black text-xl md:text-2xl lg:text-3xl">WELCOME BACK!</p>
              <p className="text-sm mt-3">Already have an account?</p>
            </div>
            <div className="mt-10 w-full">
              <SignIn />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-gradient-to-t from-yellow-300 to-yellow-500 w-1/2 h-[600px] rounded-r-lg shadow text-center">
            <div>
              <p className="font-black text-xl md:text-2xl lg:text-3xl">Hello, Friend!</p>
              <p className="text-sm mt-5">Enter your personal details and start journey with us</p>
            </div>
            <div className="mt-16"></div>
            <SignUp />
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
