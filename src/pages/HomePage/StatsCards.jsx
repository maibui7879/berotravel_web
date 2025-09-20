// components/StatsCards.jsx
import React from "react";
import { FaMapMarkedAlt, FaUsers, FaCommentDots } from "react-icons/fa";

export default function StatsCards({ stats }) {
  const statsData = [
    {
      key: "places",
      title: "Địa điểm hiện có",
      count: stats.places,
      icon: <FaMapMarkedAlt />,
      bgColor: "bg-red-500",
      textColor: "text-red-600",
      borderColor: "border-red-500",
    },
    {
      key: "users",
      title: "Người dùng",
      count: stats.users,
      icon: <FaUsers />,
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-500",
    },
    {
      key: "reviews",
      title: "Review đã tạo",
      count: stats.reviews,
      icon: <FaCommentDots />,
      bgColor: "bg-blue-500",
      textColor: "text-blue-600",
      borderColor: "border-blue-500",
    },
  ];

  return (
    <div className="my-10 px-4 md:px-20 md:ml-8">
      {/* Grid stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {statsData.map((item) => (
          <div
            key={item.key}
            className={`relative md:h-48 md:max-w-80 rounded-xl p-6 pt-12 bg-white text-center border-2 ${item.borderColor}`}
          >
            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white ${item.bgColor}`}
            >
              {React.cloneElement(item.icon, { className: "text-white text-4xl" })}
            </div>
            <h2 className={`text-3xl font-bold mt-4 ${item.textColor}`}>{item.count}</h2>
            <p className={`font-medium ${item.textColor}`}>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Giới thiệu ngắn về trang web */}
      <div className="mt-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">
          Chào mừng đến với Bero<span className="text-blue-800 font-semibold italic font-serif ">Travel
      </span>
        </h2>
        <p className="text-gray-600 text-md md:text-lg font-sans">
          BeroTravel là nền tảng giúp bạn khám phá các địa điểm ăn uống, giải trí và trải nghiệm mới quanh bạn. 
          Theo dõi những review nổi bật, tìm kiếm quán yêu thích, và kết nối với cộng đồng du lịch năng động.
        </p>
      </div>
    </div>
  );
}
