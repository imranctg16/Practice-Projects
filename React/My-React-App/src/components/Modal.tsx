import React, { Children } from "react";

interface modalType {
  isShow: boolean;
  setShow: (value: boolean) => void;
  children: React.ReactNode;
}

function Modal({ children, isShow, setShow }: modalType) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isShow ? "block" : "hidden"}`}>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setShow(false)}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;