import React from "react";

export default function ErrorMessage({ feild, isTouched }) {
  return (
    <>
      {feild && isTouched && (
        <p className="ms-3 text-red-600 text-xs  -my-1.5">{feild?.message}</p>
      )}
    </>
  );
}
