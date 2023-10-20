import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";

const Register = dynamic(() => import("auth/register"), { ssr: false });

const AuthRegister = () => {
  const { icon } = useSelector((state) => state.icon);

  return (
    <>
      <h1>from host: {icon}</h1>
      <hr />
      <Suspense fallback={null}>
        <Register />
      </Suspense>
    </>
  );
};

export default AuthRegister;
