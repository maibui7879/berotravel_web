import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/userServices/profileServices";
import { getMyStats } from "../../services/userServices/StatServices";
import { getPlaceById } from "../../services/placeServices/getPlace";
import { getRatingSummary } from "../../services/reviewServices/reviewServices";
import placeholder from "../../assets/avatar-placeholder.png";
import {
  FaHeart,
  FaStar,
  FaThumbsUp,
  FaEdit,
  FaRedo,
  FaExclamationTriangle,
} from "react-icons/fa";
import ProfileDetailList from "./ProfileDetailList";
import EditProfileModal from "./EditProfileModal";
import "./CustomProfile.css"
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      setError(null);
      const [profileData, statsData] = await Promise.all([
        getProfile(),
        getMyStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);

      if (profileData.favorites.length > 0) {
        setLoadingDetails(true);
        const items = await Promise.all(
          profileData.favorites.map(async (id) => {
            const place = await getPlaceById(id);
            const rating = await getRatingSummary(id);
            return { ...place, rating };
          })
        );
        setDetailData(items);
        setLoadingDetails(false);
      }
    } catch (err) {
      setError("Không thể tải thông tin profile hoặc thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="w-full h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        <div className="relative w-full flex flex-col items-center -mt-16 px-4">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse border-4 border-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="text-center space-y-3 mb-12">
            <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 pt-16 shadow-xl border border-white/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse border-4 border-white shadow-lg"></div>
                  <div className="space-y-4 mt-4">
                    <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded mx-auto"></div>
                    <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded mx-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-red-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Có lỗi xảy ra</h3>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaRedo className="text-sm" />
            Thử lại {retryCount > 0 && `(${retryCount})`}
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = profile.avatar_url || placeholder;
  const statsData = [
    {
      key: "favorites",
      title: "Địa điểm ưa thích",
      count: profile.favorites.length,
      icon: <FaHeart />,
      bgGradient: "from-red-50 to-pink-50",
      textColor: "text-red-600",
      iconBg: "bg-gradient-to-r from-red-500 to-pink-500",
    },
    {
      key: "reviews",
      title: "Review đã tạo",
      count: stats.reviews_created.count,
      icon: <FaStar />,
      bgGradient: "from-yellow-50 to-orange-50",
      textColor: "text-yellow-600",
      iconBg: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      key: "votes",
      title: "Lượt vote",
      count: stats.votes_created.count,
      icon: <FaThumbsUp />,
      bgGradient: "from-blue-50 to-indigo-50",
      textColor: "text-blue-600",
      iconBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full h-80 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{ backgroundImage: `url(${profile.cover_url || avatarUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full flex flex-col items-center -mt-20 px-4">
        <div className="relative mb-8 group">
          <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl">
            <div className="w-full h-full rounded-full border-4 border-white shadow-inner overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute bottom-2 right-2 p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-4 border-white group"
          >
            <FaEdit size={16} className="group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>

        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mb-3">
            {profile.name}
          </h1>
          <p className="text-gray-600 text-lg mb-4 font-medium">{profile.email}</p>
          {profile.bio && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 inline-block">
              <p className="text-gray-700 text-lg italic font-medium leading-relaxed">
                "{profile.bio}"
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
          {statsData.map((item) => (
            <div key={item.key} className="relative group">
              <div
                className={`bg-gradient-to-br ${item.bgGradient} rounded-2xl p-8 pt-16 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/30 backdrop-blur-sm relative group-hover:scale-105`}
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-current rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border border-current rounded-full"></div>
                </div>
                <div
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl ${item.iconBg} flex items-center justify-center border-4 border-white shadow-xl transform group-hover:rotate-6 transition-all duration-300`}
                >
                  {React.cloneElement(item.icon, { className: "text-white text-2xl" })}
                </div>
                <div className="text-center mt-4">
                  <h2 className={`text-4xl font-bold mb-2 ${item.textColor} tabular-nums`}>
                    {item.count.toLocaleString()}
                  </h2>
                  <p className={`font-semibold text-lg ${item.textColor}`}>{item.title}</p>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-7xl">
          <ProfileDetailList loading={loadingDetails} data={detailData} />
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={(newProfile) => setProfile(newProfile)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
