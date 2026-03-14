import React, { useState } from "react";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  async function getLogin() {
    if (!loginId || loginId === "") {
      setErrors("Enter a valid Login Id");
      return;
    }
    if (!pass || pass.length < 8) {
      setErrors("Enter a password of more than 8 characters");
      return;
    }
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginId, password: pass })
      });
      const data = await res.json();
      if (!data.success) {
        setErrors(data.message || "Login failed");
      } else {
        setErrors("");
        alert("Login Success");
        // Optionally redirect or save user info here
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors("Server error. Please try again.");
    }
  }

  const [loginId, setLoginId] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState("");
  return (
    <div className="w-screen min-h-screen p-10 flex justify-center bg-gradient-to-r from-[#000000] via-[#06325f] to-[#013026]">
      <div className="p-8 rounded-lg border-2 border-white bg-white/8 w-full h-fit mt-25 sm:w-[450px] flex flex-col items-center gap-10 justify-between ">
        <h1 className="text-white text-2xl font-bold border-b-4 border-b-white w-full pb-2">
          Client Login
        </h1>
        <input
          className="py-2 px-4 rounded-md border-3 border-cyan-400 bg-white hover:bg-white/90 w-full"
          placeholder="Enter your Email"
          onChange={(e) => {
            setLoginId(e.target.value);
            setErrors("");
          }}
        />
        <div className="rounded-md border-3 border-cyan-400 bg-white hover:bg-white/90 flex  relative justify-between items-center w-full">
          <input
            type={showPass ? "text" : "password"}
            className="py-2 px-4 pr-10 w-full"
            placeholder="password"
            onChange={(e) => {
              setPass(e.target.value);
              setErrors("");
            }}
          />
          <button
            className="absolute right-4"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        {errors && errors != "" && (
          <p className="w-full rounded-lg px-8 py-2 border-red-800 border-2 text-red-400">
            {errors}
          </p>
        )}
        <button
          onClick={() => getLogin()}
          className="py-2 px-8 bg-gradient-to-b from-[#F57B6F] to-[#FEACA3] rounded-md "
        >
          Login
        </button>
      </div>
    </div>
  );
}
