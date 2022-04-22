import React, { useEffect } from 'react'
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import db, { auth, provider, storage } from "../firebase";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import userStateSlice from '../store/userStateSlice';

function Header({ active }) {
  const user = useSelector(state => state.userState.user);
  const dispatch = useDispatch()
  const navigation = useNavigate()




  useEffect(() => {
    document.title = "Home";
  }, [])


  function signout() {
    auth.signOut()
      .then(() => {
        dispatch(userStateSlice.actions.Setuser(""))
        navigation("/", { replace: true })
      }
      )
      .catch((err) => alert(err.message));







  }
  function Goto(e, place) {
    e.preventDefault();
    navigation(place)
  }
  return (

    <Container>
      <Content>
        <Logo>
          <a href="/home">
            <img src="/images/home-logo.svg" alt="" />
          </a>
        </Logo>
        <Search>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="" />
          </SearchIcon>
        </Search>
        <Nav>{/*navbar */}

          <NavListWrap>{/*ul*/}

            <NavList onClick={(e) => Goto(e, "/home")} className={`${active == "activeHome" ? "active" : ""}`}>  {/*li */}
              <a href="/">
                <img src="/images/nav-home.svg" alt="" />
                <span>Home</span>
              </a>
            </NavList>
            <NavList>

              {/* abcdefa b scgs */}


              <a href="/">
                <img src="/images/nav-network.svg" alt="" />
                <span>My Network</span>
              </a>
            </NavList>

            <NavList>
              <a href="/">
                <img src="/images/nav-jobs.svg" alt="" />
                <span>Jobs</span>
              </a>
            </NavList>

            <NavList onClick={(e) => Goto(e, "/chat")} className={`${active == "activeHeader" ? "active" : ""}`}>
              <a href="">
                <img src="/images/nav-messaging.svg" alt="" />
                <span>Messaging</span>
              </a>
            </NavList>

            <NavList>
              <a href="/" >
                <img src="/images/nav-notifications.svg" alt="" />
                <span>Notifications</span>
              </a>
            </NavList>

            <User>
              <a>
                {user?.photoURL ? <img src={user.photoURL} /> : <img src="/images/user.svg" alt="" />}

                <span>
                  Me
                  <img src="/images/down-icon.svg" alt="" />
                </span>
              </a>

              <SignOut onClick={signout} >
                <a>Sign Out</a>
              </SignOut>
            </User>
            <Work>
              <a>
                <img src="/images/nav-work.svg" alt="" />
                <span>
                  Work<img src="/images/down-icon.svg" alt="" />
                </span>
              </a>
            </Work>
          </NavListWrap>
        </Nav>
        <Signoutbtn onClick={signout}>
          <button>Log Out</button>
        </Signoutbtn>
      </Content>
    </Container >
  )
}

const Container = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 2;

`;
const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
  overflow: auto;
  `;
const Logo = styled.span`
  margin-right: 8px;
  font-size: 0px;
  `;
const Search = styled.div`
opacity: 1;
  flex-grow: 1;
  position: relative;
  margin-right: 10px;
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
    }
  }
`;
const SearchIcon = styled.div`
 width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Nav = styled.nav`
  margin-left: auto;
  /* display: block; */
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
  }
`;
const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  justify-content: space-evenly;
  .active {
    span:after {
      content: "";
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
  }
`;
const NavList = styled.li`
  display: flex;
  align-items: center;
 
  a {
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 52px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
    }
    @media (max-width: 768px) {
      min-width: 42px;
    }
  }
  &:hover,
  &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;

const SignOut = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 47px;
  background: white;
  border-radius: 0 0 5px 5px;
  width: 80px;
  height: 30px;
  font-size: 16px;
  transition-duration: 167ms;
  /* text-align: center; */
  display: none;
  box-shadow: 0px 0px 3px 3px #cdcbca;
  a{
    text-align: center;
    margin-top: -10px;
    font-weight: 500;

  }

`;
const User = styled(NavList)`

  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  span {
    display: flex;
    align-items: center;
  }
  &:hover {
    ${SignOut} {
      display: block;
      cursor: pointer;  
      color: red;

      @media (max-width: 768px) {
      display: none;
    }
    }
  }
`;
const Work = styled(User)`
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`;

const Signoutbtn = styled.div`
display: flex;
min-width: 72px;
overflow-y: auto;

button{
  /* max-width: 200px;
  min-width: 80px; */
	padding: 4px 9px;
  cursor: pointer;
	border-radius: 20px;
	background: #0a66c2;
  text-align: center;
	color: #fff;
	font-size: 12px;
	letter-spacing: 1.1px;
	border: none;
	outline: none;
  display: none;
	&:hover {
		background: #004182;
	}
  @media (max-width: 768px) {
      display: block;
    }
}
`
  ;

export default Header;