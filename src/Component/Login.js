import React, { useEffect } from 'react'
import styled from 'styled-components';
import { SignInAPI } from "../action/index.js"
import db, { auth, provider, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { userStateAction } from "../store/userStateSlice"
import { useNavigate, Navigate } from "react-router-dom"

function Login() {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const user = useSelector(state => state.userState.user);


    useEffect(() => {
        // console.log(user);
        if (user?.uid) {
            Navigate("/home");
        }
    }, [user]);

    // console.log("login", user);

    async function signgoogle() {
        const data = await SignInAPI()
        const userdata = JSON.parse(JSON.stringify(data));

        if (data?.uid) {
            Navigate("/home");
        }

        dispatch(userStateAction.Setuser(userdata))

        // const sign = SignInAPI();
        // const user = sign();
        // console.log(user);


        // auth.signInWithPopup(provider).then(function (result) {
        //     // var token = result.credential.accessToken;
        //     var user = result.user;
        //     user = JSON.parse(JSON.stringify(user))
        //     dispatch(userStateAction.Setuser(user));

        // }).catch(function (error) {
        //     var errorCode = error.code;
        //     var errorMessage = error.message;

        //     console.log(error.code)
        //     console.log(error.message)
        // });
    }

    return (

        <Container>
            <Nav >
                <a href="/">
                    <img src="/images/login-logo.svg" alt="" />
                </a>
                <div>
                    <Join onClick={signgoogle}>Join now</Join>
                    <Signin onClick={signgoogle}>Sign in</Signin>
                </div>
            </Nav>
            <Section>
                <Hero>
                    <h1>Welcome to your professional community</h1>
                    <img src="/images/login-hero.svg" alt="" />
                </Hero>
                <Form>
                    <GoogleButton onClick={signgoogle}>
                        <img src="/images/google.svg" alt="" />
                        Sign in with Google
                    </GoogleButton>
                </Form>
            </Section>

        </Container >
    )
}

const Container = styled.div`
padding: 0;
`;
const Nav = styled.nav`

max-width: 1128px;
margin: auto;
padding: 12px 0 16px;
align-items: center;
position: relative;
display: flex;
justify-content: space-between;
flex-wrap: nowrap;

    & > a{
    width: 135px;
    height: 34px;

    @media (max-width: 768px) {
        padding: 0 5px;
    }
}
`;
const Join = styled.a`
  font-size: 16px;
  padding: 10px 12px;
  margin-right:12px ;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  color: rgba(0,0,0,0.6);

  &:hover{
      background-color: rgba(0,0,0,0.08);
      color: rgba(0,0,0,0.9);
      text-decoration: none;
  }
`;
const Signin = styled.a`
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: inset 0px 0px 0px 1px #0a66c2;
color: #0a66c2;
transition-duration: 167ms;
border-radius: 24px;
padding: 10px 24px;
font-size: 16px;
font-weight: 600;
line-height: 40px;
text-align: center;

&:hover{
    background-color: rgba(112,182,249,0.15);
}

`;
const Section = styled.div`
display: flex;
align-content:start;
min-height: 700px;
flex-wrap: wrap;
padding-top: 40px;
padding-bottom: 138px;
padding: 60px 0;
width: 100%;
position: relative;
align-items: center;
margin: auto;
max-width: 1128px;
/* border: 2px solid red; */

@media (max-width: 768px) {
  min-height: 0px;
  margin: auto;
}
`;
const Hero = styled.div`
    
    width: 100%;
    h1{
        width: 55%;
        font-size:56px;
        color: #2977c9;
        font-weight: 300;
        line-height: 70px;

        @media (max-width: 768px) {
            width: 100%;
            font-size: 20px;
            text-align: center;
            line-height: 2;
        }
    }
    img{
        width: 700px;
        height: 670px;
        position: absolute;
        right: -150px;
        bottom: -2px;
        @media (max-width: 786px) {
            top: 230px;
            height: initial;
            width: initial;
            position: initial;
            
        }
    }
`
const Form = styled.div`
     margin-top: 100px;
     width: 408px;
  

       @media (max-width: 768px) {
           margin:0 20%;
           margin-top: 20px;
  }
`;
const GoogleButton = styled.button`
  display: flex;
  justify-content: center;
  background-color: #fff;
  align-items: center;
  height: 56px;
  width: 100%;
  border-radius: 28px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 60%),
    inset 0 0 0 2px rgb(0 0 0 / 0%) inset 0 0 0 1px rgb(0 0 0 / 0);
  vertical-align: middle;
  z-index: 0;
  transition-duration: 167ms;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.6);
  &:hover {
    background-color: rgba(207, 207, 207, 0.25);
    color: rgba(0, 0, 0, 0.75);
  }

  & > img{
      margin-right: 7px;
  }
`;


export default Login;