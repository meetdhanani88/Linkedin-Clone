import React from 'react';
import ChatMessage from './ChatMessage';
import styled from "styled-components";
function ChatRoom() {
    return (
        <>
            <main>

                <ChatMessage />

                <span ></span>

            </main>

            <Comment>
                <Writecomment>
                    <form>
                        <Commnetinput>
                            <Commentimg>
                                <img src={"https://lh3.googleusercontent.com/a/AATXAJwgpU8exK7QHqIJhPjwvtTL-W5wfEwXeorYGvyk=s96-c"} alt="" />
                            </Commentimg>

                            <textarea placeholder='Write any comment' autoFocus={true} name={'cmt'} ></textarea>

                            <Postcomment>
                                <button type='submit'>Post</button>
                            </Postcomment>

                        </Commnetinput>
                    </form>

                </Writecomment>

            </Comment>
        </>
    )
}

const Comment = styled.div`
display:flex;
position: absolute;
bottom: 15px;
flex-direction: column;
border-radius: 20px;
box-shadow: 0px 0px 5px 5px #cdcbca;
width: 90%;
margin-left: 5%;
animation: mymove 1s ease;
@keyframes mymove {
  from {opacity: 0;}
  to {opacity: 1;}
}

`;

const Writecomment = styled.div`

display: flex;
align-items: flex-end;
/* border-bottom: 2px solid black; */
form{
	width: 100%;
}

`;
const Commentimg = styled.div`
	text-align: center;
	display: flex;
	justify-content: center;

img{
	height: 40px;
    width: 40px;
	border-radius: 50%;
	margin-left: 10px;
	margin-right: 5px;
    margin-top: -2px;

}

`;
const Commnetinput = styled.div`
margin-top: 10px;
width: 100%;
/* border: 2px solid red; */
display: flex;
flex-direction: row;

textarea{
	    width:80%;
		min-height: 10px;
		height: auto;
		resize: none;
		overflow: hidden;
		font-size: 20px;
  		font: inherit;
		padding: 0px 10px;
		border:none;
		outline: none;
}

`;
const Postcomment = styled.div`
justify-content: flex-start;
/* border: 1px solid red; */
display: flex;
background-color: transparent;
margin-bottom: 10px;
margin-right: 8px;

button{
	min-width: 60px;
    padding: 0 16px;
    border-radius: 20px;
    background: #0a66c2;
    color: #fff;
    font-size: 16px;
    letter-spacing: 1.1px;
    border: none;
    outline: none;
  &:hover{
	background-color:#004182;
  }

}
`;


export default ChatRoom