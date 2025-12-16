import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  /* ===== STATES ===== */
  const [showModal, setShowModal] = useState(false);
  const [counselors, setCounselors] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  /* ===== HANDLE INPUT ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  /* ===== FETCH COUNSELORS ===== */
  const fetchCounselors = async () => {
    try {
      const res = await fetch("http://localhost:4000/admin/counselors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setCounselors(data);
    } catch {
      console.error("Failed to fetch counselors");
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, []);

  /* ===== ADD COUNSELOR ===== */
  const addCounselor = async () => {
    if (!form.name || !form.email || !form.password) {
      setMessage("Шаардлагатай бүх талбарыг бөглөнө үү");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:4000/admin/add-counselor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Алдаа гарлаа");
        setMessageType("error");
        return;
      }

      // ✅ SUCCESS
      setMessage("Counselor амжилттай бүртгэгдлээ");
      setMessageType("success");

      setForm({ name: "", email: "", phone: "", password: "" });
      fetchCounselors();

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
      }, 1500);
    } catch {
      setMessage("Сервертэй холбогдож чадсангүй");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== TOP BAR ===== */}
      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
          >
            + Counselor нэмэх
          </button>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Нийт counselor</p>
          <p className="text-3xl font-bold mt-2">
            {counselors.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Нийт student</p>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Идэвхтэй хэрэглэгч</p>
          <p className="text-3xl font-bold mt-2">—</p>
        </div>
      </div>

      {/* ===== COUNSELOR LIST ===== */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Counselor жагсаалт
          </h2>

          {counselors.length === 0 ? (
            <p className="text-gray-500">
              Одоогоор counselor бүртгэгдээгүй байна
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-2">Нэр</th>
                  <th className="py-2">Имэйл</th>
                  <th className="py-2">Утас</th>
                </tr>
              </thead>
              <tbody>
                {counselors.map((c) => (
                  <tr key={c._id} className="border-b">
                    <td className="py-2">{c.name || "-"}</td>
                    <td className="py-2">{c.email}</td>
                    <td className="py-2">{c.phone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-xl font-semibold mb-6">
              Шинэ Counselor бүртгэх
            </h2>

            <div className="space-y-4">
              <input
                name="name"
                placeholder="Нэр"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />
              <input
                name="email"
                type="email"
                placeholder="Имэйл"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />
              <input
                name="phone"
                placeholder="Утасны дугаар"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />
              <input
                name="password"
                type="password"
                placeholder="Түр нууц үг"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              {message && (
                <p
                  className={`text-sm ${
                    messageType === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Болих
              </button>

              <button
                onClick={addCounselor}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
