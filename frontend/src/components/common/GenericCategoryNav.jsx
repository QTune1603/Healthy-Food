// src/components/common/GenericCategoryNav.jsx
import React from "react";

const GenericCategoryNav = React.memo(({ 
  mainCategories = [], 
  subCategories = [], 
  selectedCategory, 
  onSelect 
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4">
          {/* All button */}
          <button
            onClick={() => onSelect("all")}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-[#3C493F] text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">🍽️</span>
            Tất Cả
          </button>

          {/* Main categories */}
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-[#3C493F] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </button>
          ))}

          {/* Sub-categories */}
          {subCategories.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === item.id
                  ? "bg-[#3C493F] text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default GenericCategoryNav;
