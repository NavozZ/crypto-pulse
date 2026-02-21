import Navigation from "../ui/Navigation";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
      
    </>
  );
}

export default RootLayout;
