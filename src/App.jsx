
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Board from './pages/Board'
import CreateBoard from './pages/CreateBoard'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Login from './pages/Login'
import Layout from './layout/Layout'




function App() {


  return (
    <>


      <Routes>
        


        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home></Home>}></Route>

          <Route path="/board/:id" element={<Board></Board>}></Route>
          <Route path="/boards/new" element={<CreateBoard></CreateBoard>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
        </Route>



        <Route path="/notfound" element={<NotFound></NotFound>}></Route>





      </Routes>



    </>
  )
}

export default App
