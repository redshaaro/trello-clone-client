import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";


const Layout = () => {
  const state = useAuth()
  console.log(state)
  const token = state.state.token
  console.log(token)


  return (
    <>
      {token ? <Navbar>

      </Navbar> : ""}

      <main>
        <Outlet></Outlet>

      </main>
    </>



  )
}

export default Layout