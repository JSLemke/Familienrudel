'use client';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        {children}
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
