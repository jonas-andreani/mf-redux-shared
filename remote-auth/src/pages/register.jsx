import React from "react";
import { StoreProvider, useStore } from "host/store";

const Register = () => {
  const { icon, iconMoon, iconSun } = useStore();
  return (
    <div>
      <h1>from remote: {icon}</h1>
      <button onClick={iconMoon}>Moon</button>
      <button onClick={iconSun}>Sun</button>
    </div>
  );
};

export default () => (
  <StoreProvider>
    <Register />
  </StoreProvider>
);
