import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../api/axios";

const SharedLayout = (props) => {

  const [isSidebarHiden, setIsSidebarHiden] = useState(true);

  const handleHidenChange = (isHiden) => {
    setIsSidebarHiden(isHiden);
  };
  
  useEffect(() => {
    axios
      .get(`/api/users/${props.user.id}`)
      .then((response) => props.setUser(response.data.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Sidebar user={props.user} isSidebarHiden={isSidebarHiden} />
      <section id="content">
        <Navbar
          user={props.user}
          isSidebarHiden={isSidebarHiden}
          onHidenSidebarChange={handleHidenChange}
        />
        <Outlet />
      </section>
    </>
  );
};

export default SharedLayout;
