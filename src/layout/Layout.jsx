import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


const Layout = () => {
  const logged = true
  return (
    <>
      {logged ? <Navbar>

      </Navbar> : ""}

      <main>
        <Outlet></Outlet>

      </main>
    </>



  )
}

export default Layout