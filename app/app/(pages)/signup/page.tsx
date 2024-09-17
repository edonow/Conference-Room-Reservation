"use client";

import { validateEmail, validatePassword } from "@/app/utils/Validate";
import { createUser } from "@/app/utils/functions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignUpPage = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [organaization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }
    const emailError = validateEmail(email);
    if (emailError) {
      setEmailError(emailError);
      return;
    }
    if (firstName === null || firstName === "") {
      setFirstNameError("Please enter your First Name");
      return;
    }

    if (lastName === null || lastName === "") {
      setLastNameError("Please enter your Last Name");
      return;
    }

    createUser(firstName, lastName, organaization, email, password)
      .then((data) => {
        localStorage.setItem("userId", data.user.user_id);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("expiresAt", data.expires_at);
        router.push("/top");
      })
      .catch((error) => {
        setError(`An error occurred while creating the user. Status code: ${error.status}`);
      });
  };
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };
  const handlelastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setLastNameError("");
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="flex w-3/4">
          <div className="relative flex justify-center items-center bg-white w-full h-[600px] rounded-lg shadow text-center overflow-hidden">
            {/* --------------------------- LEFT SIDE (Image) --------------------------- */}
            <div className="flex flex-col items-center justify-center w-1/2">
              <div className="relative inline-block z-10 ml-5 xl:ml-0">
                <Image
                  src="/images/signup.png"
                  alt="signup"
                  width={400}
                  height={400}
                  priority
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute left-0 bottom-[-80px]">
                  <p className="text-left text-2xl font-black">Let's Make It</p>
                  <p className="text-left text-2xl font-black">Happen Together!</p>
                </div>
              </div>
            </div>
            {/* --------------------------- SIGN UP FORM --------------------------- */}
            <div className="w-1/2 z-10">
              <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                {/* ----- Last & First Name -----*/}
                <div className="flex w-[80%] mb-4">
                  <div className="flex flex-col items-start w-full pr-2">
                    <label className="text-left text-xs text-gray-900 w-full">
                      First Name<span className="text-red-400"> *</span>
                    </label>
                    <input
                      type="text"
                      className="bg-inherit border border-black rounded-lg w-full px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
                      value={firstName}
                      placeholder="First Name"
                      onChange={handleFirstNameChange}
                    />
                    {firstNameError && (
                      <div className="w-full">
                        <p className="text-red-500 text-xs mt-1 text-left">{firstNameError}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start w-full pl-2">
                    <label className="text-left text-xs text-gray-900 w-full">
                      Last Name<span className="text-red-400"> *</span>
                    </label>
                    <input
                      type="text"
                      className="bg-inherit border border-black rounded-lg w-full px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
                      value={lastName}
                      placeholder="Last Name"
                      onChange={handlelastNameChange}
                    />
                    {lastNameError && (
                      <div className="w-full">
                        <p className="text-red-500 text-xs mt-1 text-left">{lastNameError}</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* ----------- Organization ----------- */}
                <div className="flex flex-col items-center w-full mb-4">
                  <label className="text-left text-xs text-gray-900 w-[80%]">Organization (optinal)</label>
                  <input
                    type="text"
                    className="bg-inherit border border-black rounded-lg w-[80%] px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
                    value={organaization}
                    placeholder="Organization"
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
                {/* ----------- Email ----------- */}
                <div className="flex flex-col items-center w-full mb-4">
                  <label className="text-left text-xs text-gray-900 w-[80%]">
                    E-mail<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="text"
                    className="bg-inherit border border-black rounded-lg w-[80%] px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
                    value={email}
                    placeholder="*****@example.com"
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <div className="w-[80%]">
                      <p className="text-red-500 text-xs mt-1 text-left">{emailError}</p>
                    </div>
                  )}
                </div>
                {/* ----------- Password ----------- */}
                <div className="flex flex-col items-center w-full mb-4">
                  <label className="text-left text-xs text-gray-900 w-[80%]">
                    Password<span className="text-red-400"> *</span>
                  </label>
                  <input
                    type="password"
                    className="bg-inherit border border-black rounded-lg w-[80%] px-3 py-1 mt-1 placeholder:text-xs placeholder-gray-300"
                    value={password}
                    placeholder="********"
                    onChange={handlePasswordChange}
                  />
                  {/* ----------- Password Error Check ----------- */}
                  {passwordError && (
                    <div className="w-[80%]">
                      <p className="text-red-500 text-xs mt-1 text-left">{passwordError}</p>
                    </div>
                  )}
                </div>
                <div className="w-[80%]">
                  <p className="text-xs text-left">
                    <span className="text-red-400">*</span> required entry
                  </p>
                </div>
                {/* ----------- SIGN UP BUTTON ----------- */}
                <div className="mt-10 w-[60%]">
                  <button
                    type="submit"
                    className="text-sm font-bold w-full px-4 py-2 border border-black rounded-3xl shadow-lg hover:border-yellow-300 hover:text-yellow-300"
                  >
                    SIGN UP
                  </button>
                </div>
              </form>
              {error && <p className="mt-5 text-red-400 text-sm">{error}</p>}
            </div>
            {/* ------------------------------------------------------------------------ */}
            <div className="absolute bottom-[-120px] left-[-120px] w-[300px] h-[300px] md:bottom-[-200px] md:left-[-200px] md:w-[600px] md:h-[600px] bg-yellow-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
