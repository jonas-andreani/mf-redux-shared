import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const Home = dynamic(() => import("auth/index"), { ssr: false });

const AuthRegister = (props) => {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
};

export default AuthRegister;
