import React, { useContext } from "react";
import Left from "./components/home/Left";

const App = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-4xl font-bold text-center">Welcome to dashboard</h1>
        <Left />
    </div>
  );
};

export default App;
