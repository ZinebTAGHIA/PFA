import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "../../api/axios";

const SharedLayout = (props) => {
  const [isSidebarHiden, setIsSidebarHiden] = useState(true);

  const handleHidenChange = (isHiden) => {
    setIsSidebarHiden(isHiden);
  };

  useEffect(() => {
    axios
      .get(`/api/users/${props.user.id}`)
      .then((response) => {
        props.setUser(response.data.data);
        axios
          .get(`/api/users/role/${response.data.data.id}`)
          .then((response) => props.setRole(response.data.role))
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`/api/users/role/${props.user.id}`)
  //     .then((response) => props.setRole(response.data.role))
  //     .catch((error) => console.error(error));
  // }, []);

  return (
    <>
      <Sidebar
        role={props.role}
        user={props.user}
        isSidebarHiden={isSidebarHiden}
      />
      <section id="content">
        <Navbar
          setRole = {props.setRole}
          user={props.user}
          isSidebarHiden={isSidebarHiden}
          onHidenSidebarChange={handleHidenChange}
          setType = {props.setUser}
        />
        <Outlet />
      </section>
    </>
  );
};

export default SharedLayout;
