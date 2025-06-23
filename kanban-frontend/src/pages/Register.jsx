import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      setToast("✅ Registration successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setToast(err.response?.data?.message || "❌ Registration failed");
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-800 p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-700 border border-zinc-600"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-700 border border-zinc-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-zinc-700 border border-zinc-600"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
        >
          Register
        </button>
        <p className="text-sm text-center text-zinc-400 mt-2">
          Already have an account?{" "}
          <a href="/" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>

      {/* Toast Message */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
