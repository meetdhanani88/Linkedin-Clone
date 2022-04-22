import { auth } from "./firebase";
import './App.css';
import { BrowserRouter as Routers, Route, Routes, Navigate } from "react-router-dom"
import Login from './Component/Login';
import Header from './Component/Header';
import Home from './Component/Home';
import { useDispatch, useSelector } from "react-redux";
import { userStateAction } from "./store/userStateSlice"
import { useEffect } from 'react';
import Chat from "./Component/chat/Chat";

function App() {
  const dispatch = useDispatch();
  const usedata = useSelector(state => state.userState.user)

  useEffect(() => {
    auth.onAuthStateChanged(
      (user) => {
        if (user?.uid) {
          // console.log(user);
          const userdata = JSON.parse(JSON.stringify(user))
          dispatch(userStateAction.Setuser(userdata));
        }
      }
    )
  }, []);

  return (
    <div className="App">

      <Routers>
        <Routes>

          <Route path='/' element={<Login />} />

          {usedata?.uid &&
            <Route path='/home' element={
              <>
                <Header active="activeHome"></Header>
                <Home></Home>
                {/* <Chat></Chat> */}

              </>
            } />

          }
          <Route path='/chat' element={<Chat />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </Routers>
    </div>
  );
}

export default App;
