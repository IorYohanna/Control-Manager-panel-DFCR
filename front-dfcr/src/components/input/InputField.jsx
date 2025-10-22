import React from "react";

export default function InputField({
    placeholder = "Entrer votre email",
}) {
  return (
    <div className="relative w-64 mx-auto mt-12">
      <input
        type="text"
        id="input"
        required
        className="peer w-full border-0 border-b-2 border-gray-300 bg-transparent text-lg text-gray-800 focus:border-gray-800 focus:outline-none"
      />
      <label
        htmlFor="input"
        className="absolute left-0 top-0 text-gray-400 text-base transition-all duration-300 ease-in-out peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-lg peer-focus:-top-5 peer-focus:text-gray-800 peer-focus:text-sm"
      >
        {placeholder}
      </label>
      <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-gray-800 transition-transform duration-300 ease-in-out peer-focus:scale-x-100"></span>
    </div>
  );
}
