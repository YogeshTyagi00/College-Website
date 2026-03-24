import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header.jsx";

const API = import.meta.env.MODE === 'development' ? "http://localhost:3000/route" : "/route";

const tabs = [
  { key: "event", label: "Add Event" },
  { key: "society", label: "Add Society" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("event");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error("Paste some text first");
    setLoading(true);
    setPreview(null);
    try {
      const endpoint = activeTab === "event" ? "/ai/event" : "/ai/society";
      const { data } = await axios.post(`${API}${endpoint}`, { text }, { withCredentials: true });
      setPreview(data[activeTab]);
      toast.success(`${activeTab === "event" ? "Event" : "Society"} saved successfully`);
      setText("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Paste WhatsApp text or any raw description — AI will extract and save it automatically.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setPreview(null); setText(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={
            activeTab === "event"
              ? "Paste WhatsApp message about an event here...\n\nExample:\nTechFest 2025 is happening on 15th March at Seminar Hall. Register at forms.gle/xyz. Organized by IEEE DTU."
              : "Paste WhatsApp message about a society here...\n\nExample:\nDTU Photography Club is recruiting! Join us on Instagram @dtuphotography. Open for all branches."
          }
          className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Parsing with AI..." : `Parse & Save ${activeTab === "event" ? "Event" : "Society"}`}
        </button>

        {/* Preview */}
        {preview && (
          <div className="mt-6 bg-gray-900 border border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Saved record</p>
            <pre className="text-xs text-green-400 overflow-auto whitespace-pre-wrap">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
