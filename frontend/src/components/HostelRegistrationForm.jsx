import React from "react";

const HostelRegistrationForm = () => {
  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Hostel Registration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Hostel Name
        </label>
        <input
          type="text"
          placeholder="Enter hostel name"
          className="form-input mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          placeholder="Enter number of students"
          className="form-input mt-1"
        />
      </div>

      <button type="submit" className="form-button w-full">
        Register Hostel
      </button>
    </form>
  );
};

export default HostelRegistrationForm;
