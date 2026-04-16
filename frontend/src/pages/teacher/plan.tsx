
import React, { useState } from "react";



export default function Teacherplan() {



  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement  | HTMLTextAreaElement >) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Plan Data:", formData);

   

    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Teaching Plan (weakly or monthly)
      </h1>

      {/* Form Card */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full sm:max-w-lg  md:max-w-xl lg:max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-5 w-full ">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Week 1 - Algebra Basics"
                className="w-full p-3 border rounded-xl focus:outline-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Write what you will teach this week..."
                className="w-full p-3 border rounded-xl focus:outline-blue-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
              >
                Submit Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}