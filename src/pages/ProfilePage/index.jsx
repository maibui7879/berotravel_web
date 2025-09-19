import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/userServices/profileServices";
import { getMyStats } from "../../services/userServices/StatServices";
import placeholder from "../../assets/avatar-placeholder.png";
import { FaHeart, FaStar, FaThumbsUp, FaEdit } from "react-icons/fa";
import { getPlaceById } from "../../services/placeServices/getPlace";
import { getRatingSummary } from "../../services/reviewServices/reviewServices";
import ProfileDetailList from "./ProfileDetailList";
import EditProfileModal from "./EditProfileModal";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detailData, setDetailData] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Đang tải profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    );

  const avatarUrl = profile.avatar_url || placeholder;

  const statsData = [
    {
      key: "favorites",
      title: "Địa điểm ưa thích",
      count: profile.favorites.length,
      icon: <FaHeart />,
      bgColor: "bg-red-500",
      borderColor: "border-red-500",
      textColor: "text-red-500",
    },
    {
      key: "reviews",
      title: "Review đã tạo",
      count: stats.reviews_created.count,
      icon: <FaStar />,
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-500",
    },
    {
      key: "votes",
      title: "Lượt vote",
      count: stats.votes_created.count,
      icon: <FaThumbsUp />,
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500",
      textColor: "text-blue-500",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Cover */}
      <div className="w-full h-64 relative flex justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.cover_url || avatarUrl})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />

        <div className="absolute -bottom-16">
          <div className="relative border-4 border-white rounded-full">
            <img
              src={avatarUrl}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-0.5 -right-0.5 text-gray-700 p-2 rounded-full bg-white border-gray-50 border-4 hover:bg-blue-500 transition hover:text-white"
            >
              <FaEdit size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-gray-400 text-sm mb-2">{profile.email}</p>
        {profile.bio && profile.bio.trim() !== "" && (
          <i className="font-semibold text-xl">{profile.bio}</i>
        )}
        <i className="text-gray-400 text-xs mt-2 block">
          Tài khoản tạo ngày {new Date(profile.createdAt).toLocaleDateString()}
        </i>
      </div>

      {/* Stats Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-20 md:ml-8">
        {statsData.map((item) => (
          <div
            key={item.key}
            className={`relative md:h-48 md:max-w-80 rounded-xl p-6 pt-12 bg-white text-center border-2 ${item.borderColor}`}
          >
            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white ${item.bgColor}`}
            >
              {React.cloneElement(item.icon, {
                className: "text-white text-4xl",
              })}
            </div>

            <h2 className={`text-3xl font-bold mt-4 ${item.textColor}`}>
              {item.count}
            </h2>
            <p className={`font-medium ${item.textColor}`}>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Detail List */}
      <div className="w-full px-4 md:px-20 mb-10 md:ml-8">
        <ProfileDetailList loading={loadingDetails} data={detailData} />
      </div>

      {/* Edit Modal */}
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
