import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    if (data.user.role === "admin") navigate("/admin");
    else if (data.user.role === "counselor") navigate("/counselor");
    else navigate("/student");
  };

  return (
    <div className="min-h-screen bg-[#FFF6ED] flex items-center justify-center">
      <div className="w-full max-w-5xl bg-[#FFF1E6] rounded-3xl flex overflow-hidden">
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-semibold mb-8">Welcome Back!!</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="w-full px-4 py-3 rounded-full border"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-full border"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500">{error}</p>}

            <button className="w-full py-3 rounded-full bg-orange-300">
              Login
            </button>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 bg-[#FFE0C8] items-center justify-center">
          <img src="/illustration.png" className="w-3/4" />
        </div>
      </div>
    </div>
  );
}
