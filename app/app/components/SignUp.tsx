import Link from "next/link";
import { FC } from "react";

const SignUp: FC = () => {
  return (
    <>
      <Link href="/signup" className="w-[70%] text-white font-bold border-2 rounded-3xl py-1 shadow">
        SIGN UP
      </Link>
    </>
  );
};
export default SignUp;
