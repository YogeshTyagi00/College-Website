import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Shield, Clock, CheckCircle, XCircle, Users, Loader } from "lucide-react";
import Header from "../components/Header.jsx";

const API = import.meta.env.MODE === 'development' ? "http://localhost:3000/route" : "/route";

const STATUS_TABS = [
  { key: "pending",  label: "Pending",  icon: Clock,        color: "text-amber-400"  },
  { key: "approved", label: "Approved", icon: CheckCircle,  color: "text-green-400"  },
  { key: "rejected", label: "Rejected", icon: XCircle,      color: "text-red-400"    },
];

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pending,  setPending]  = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [actionId, setActionId] = useState(null); // userId currently being acted on

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/admin-request/all`, { withCredentials: true });
        setPending(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleReview = async (userId, action) => {
    setActionId(userId);
    try {
      await axios.patch(
        `${API}/admin-request/${userId}/review`,
        { action },
        { withCredentials: true }
      );

      // Find the user being acted on
      const target = pending.find((u) => u._id === userId);

      // Optimistic: remove from pending, push to correct tab
      setPending((prev) => prev.filter((u) => u._id !== userId));
      if (action === "approve") {
        setApproved((prev) => [{ ...target, adminRequestStatus: "approved" }, ...prev]);
        toast.success(`${target?.userName} approved as admin`);
      } else {
        setRejected((prev) => [{ ...target, adminRequestStatus: "rejected" }, ...prev]);
        toast.success(`${target?.userName}'s request rejected`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const lists = { pending, approved, rejected };
  const currentList = lists[activeTab];

  const timeAgo = (dateStr) => {
    if (!dateStr) return "—";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return "just now";
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <div className="max-w-7xl mx-auto pt-20 sm:pt-24 pb-10 px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              SuperAdmin
            </span>{" "}
            Panel
          </h1>
          <p className="text-gray-400 text-sm">
            Review and manage admin access requests from users.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const count = lists[tab.key].length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.key ? "text-white" : tab.color}`} />
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-700 text-gray-300"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <Loader className="w-6 h-6 animate-spin mr-3" />
            <span className="text-sm">Loading requests...</span>
          </div>
        ) : currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <Users className="w-12 h-12 mb-4 opacity-40" />
            <p className="text-sm">No {activeTab} requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentList.map((user) => (
              <div
                key={user._id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-gray-600"
              >
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {user.userName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{user.userName}</p>
                    <p className="text-xs text-gray-500">{timeAgo(user.updatedAt)}</p>
                  </div>

                  {/* Status badge for non-pending tabs */}
                  {activeTab !== "pending" && (
                    <span className={`ml-auto shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                      activeTab === "approved"
                        ? "bg-green-900/50 text-green-400 border border-green-800"
                        : "bg-red-900/50 text-red-400 border border-red-800"
                    }`}>
                      {activeTab}
                    </span>
                  )}
                </div>

                {/* Action buttons — only on pending tab */}
                {activeTab === "pending" && (
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleReview(user._id, "reject")}
                      disabled={actionId === user._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors border border-gray-700"
                    >
                      {actionId === user._id
                        ? <Loader className="w-3.5 h-3.5 animate-spin" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview(user._id, "approve")}
                      disabled={actionId === user._id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      {actionId === user._id
                        ? <Loader className="w-3.5 h-3.5 animate-spin" />
                        : <CheckCircle className="w-3.5 h-3.5" />}
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
