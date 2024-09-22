import { useState } from "react";
import { useRouter } from "next/router";
import axiosApiInstance from "@/lib/axios.config";
import { useError } from "../components/errorContext";
import { API_ROUTES } from "@/constants";
import Layout from "@/components/layout";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { showError } = useError();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosApiInstance.post(API_ROUTES.LOGIN, {
        username: email,
        password: password,
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh", response.data.refresh_token);
      router.push("/");
    } catch (error) {
      showError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Layout fullPageBackground>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
      >
        <div className="bg-black bg-opacity-75 p-10 rounded-md w-full max-w-md">
          <h2 className="text-netflix-white text-3xl font-bold mb-6">
            Sign In
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-netflix-white rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 bg-gray-700 text-netflix-white rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-netflix-red text-netflix-white p-3 rounded font-bold"
            >
              Sign In
            </button>
          </form>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center text-netflix-white text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember me
            </label>
            <a href="#" className="text-netflix-white text-sm">
              Forgot password?
            </a>
          </div>
          <p className="text-netflix-white mt-4">
            New to Netflix?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign up now
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
