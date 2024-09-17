"use client";

import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";
import { validateEmail, validatePassword } from "../utils/Validate";
import { loginUser } from "../utils/functions";

const SignIn: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password != process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setPasswordError(passwordError);
        return;
      }
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }

    loginUser(email, password)
      .then((data) => {
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("expiresAt", data.expires_at);
        router.push("/top");
      })
      .catch((error) => {
        setEmail(email);
        setPassword(password);
        if (error instanceof Error && error.message === "Unauthorized") {
          setError("Invalid email or password");
        } else {
          setError("An error occurred while logging in");
        }
      });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full">
          <label className="text-left text-sm text-gray-900 w-11/12">E-mail</label>
          <input
            type="text"
            className="bg-inherit border border-black rounded-lg w-[90%] px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
            value={email}
            placeholder="your-email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <div className="w-[90%]">
              <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
            </div>
          )}
        </div>
        <div className="my-5"></div>
        <div className="flex flex-col items-center w-full">
          <label className="text-left text-sm text-gray-900 w-11/12">Password</label>
          <input
            type="password"
            className="bg-inherit border border-black rounded-lg w-[90%] px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
            value={password}
            placeholder="********"
            onChange={handlePasswordChange}
          />

          {passwordError && (
            <div className="w-[90%]">
              <p className="text-red-500 text-xs mt-1 text-left">{passwordError}</p>
            </div>
          )}
        </div>
        {error && (
          <div className="w-[90%]">
            <p className="text-red-500 text-xs mt-1 text-left">{error}</p>
          </div>
        )}
        <div className="mt-10 w-[70%]">
          <button
            type="submit"
            className="text-sm font-bold w-full px-4 py-2 border border-black rounded-3xl shadow-lg hover:border-yellow-300 hover:text-yellow-300"
          >
            SIGN IN
          </button>
        </div>
      </form>
    </>
  );
};
export default SignIn;
