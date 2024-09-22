import { useState } from "react";
import { useRouter } from "next/router";
import { useError } from "../components/errorContext";
import axiosApiInstance from "@/lib/axios.config";
import { API_ROUTES } from "@/constants";
import Layout from "@/components/layout";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const router = useRouter();
  const { showError } = useError();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axiosApiInstance.post(API_ROUTES.SIGNUP, {
        email,
        firstName: firstName,
        lastName: lastName,
        password,
        mobileNumber: mobileNumber || null,
      });
      router.push("/login");
    } catch (error) {
      showError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <Layout fullPageBackground>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
      >
        <div className="bg-black bg-opacity-75 p-10 rounded-md w-full max-w-md">
          <h2 className="text-netflix-white text-3xl font-bold mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-netflix-white rounded"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-netflix-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-netflix-white rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-netflix-white rounded"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number (optional)"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-3 mb-6 bg-gray-700 text-netflix-white rounded"
            />
            <button
              type="submit"
              className="w-full bg-netflix-red text-netflix-white p-3 rounded font-bold"
            >
              Sign Up
            </button>
          </form>
          <p className="text-netflix-white mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Sign In now
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
