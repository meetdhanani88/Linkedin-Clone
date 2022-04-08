import React, { useState } from 'react'
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

function LikeCommentModal({ setshowLikecmtmodal, clickedpostdata, isLiksection, iscmsection }) {
    const articles = useSelector(state => state.articleState.articles);

    const [isLikesection, setisLikesection] = useState(isLiksection);
    const [iscmtsection, setiscmtsection] = useState(iscmsection);

    const clickearticle = articles.filter((_, index) => clickedpostdata.postindex == index);
    // console.log(clickearticle);
    const wholike = clickearticle[0].likes.whoLiked;

    // console.log(wholike)
    function resetallstate() {
        setshowLikecmtmodal(false);
        setisLikesection(false);
        setiscmtsection(false)
    }
    return (
        <Container>
            <Content>
                <Header>
                    <div>
                        <span onClick={() => { setisLikesection(true); setiscmtsection(false) }} >
                            <img src="/images/Like-icon.svg" alt="" />
                            <p>Likes</p>
                        </span>

                        <span onClick={() => { setisLikesection(false); setiscmtsection(true) }}>
                            <img src="/images/comment-icon.svg" alt="" />
                            <p>Comments</p>
                        </span>
                    </div>

                    <button onClick={() => { resetallstate() }}>
                        <img src="/images/close-icon.svg" alt="" />
                    </button>
                </Header>

                {isLikesection &&
                    <LikeSection>
                        <SocialCount>
                            <li>
                                <button>
                                    <img src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="like" />
                                    <span>{wholike.length}</span>
                                </button>
                            </li>
                        </SocialCount>

                        {wholike.map((item, index) => {

                            return (<SharedActor key={index}>
                                <a>
                                    <img src={item.image} alt="" />
                                    <div>
                                        <span>{item.name}</span>
                                        <span>{item.email}</span>
                                    </div>
                                </a>

                            </SharedActor>)

                        })}


                    </LikeSection>
                }

                {iscmtsection && <Commentsection>
                    <div>Comment section will be here soon</div>
                </Commentsection>}


            </Content>
        </Container >
    )
}

const Container = styled.div`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 11;
	background-color: rgba(0, 0, 0, 0.8);
	animation: fadeIn 0.5s ease;
`;

const Content = styled.div`
	width: 100%;
	max-width: 552px;
	max-height: 90%;
	background-color: #fff;
	overflow: initial;
	border-radius: 5px;
	position: relative;
	display: flex;
	flex-direction: column;
	top: 60px;
    padding-bottom: 15px;
	margin: 0 auto;
`;

const Header = styled.div`
	display: block;
	padding: 10px 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	font-size: 15px;
	line-height: 1.5;
	color: rgba(0, 0, 0, 0.9);
	display: flex;
	justify-content: space-between;
	align-items: center;


    div{
        display: flex;
        /* border: 1px solid red; */
        
     
        span{
            display: flex;
            align-items: center;
            justify-content: center;
            vertical-align: baseline;
            img{
                margin-right: 3px;
            }
            &:first-child{
              margin-left: 2px;
              margin-right: 7px;
              padding-right: 8px;
              border-right: 1px solid rgba(0, 0, 0, 0.3);
            }
            &:hover{
                cursor: pointer;
                text-decoration: underline;
            }       
       
         }
            
           
        }   
	button {
		width: 40px;
		height: 40px;
		min-width: auto;
		border: none;
		outline: none;
		background: transparent;
        &:hover{
                cursor: pointer;
            }
		img,
		svg {
           
			pointer-events: none;
		}
    
	}
`;
const SocialCount = styled.ul`
	line-height: 1.3;
	display: flex;
	align-items: flex-start;
	overflow: auto;
	margin: 0 16px;
	padding: 8px 0;
	border-bottom: 1px solid #e9efdf;
	color: rgba(0, 0, 0, 0.6);
	list-style: none;
	li {
		margin-right: 5px;
		font-size: 12px;
		button {
			display: flex;
			border: none;
			color: rgba(0, 0, 0, 0.6);
			background: transparent;
			span {
				padding-left: 5px;
			}
		}
	}
`;
const LikeSection = styled.div`

`;


const SharedActor = styled.div`
	padding-right: 40px;
	flex-wrap: nowrap;
	padding: 12px 19px 0;
	margin-bottom: 8px;
	display: flex;
	align-items: center;
	a {
		margin-right: 12px;
		flex-grow: 1;
		overflow: hidden;
		display: flex;
		img {
			width: 35px;
			height: 35px;
			border-radius: 50%;
		}
		& > div {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			flex-basis: 0;
			margin-left: 8px;
			overflow: hidden;
			span {
				text-align: left;
				&:first-child {
					font-size: 14px;
					font-weight: 700;
					color: #000;
				}
				&:nth-child(n + 2) {
					font-size: 12px;
					color: rgba(0, 0, 0, 0.6);
				}
			}
		}
	}
	button {
		position: absolute;
		top: 0;
		right: 12px;
		border: none;
		outline: none;
		background: transparent;
	}
`;


const Commentsection = styled.div``;
export default LikeCommentModal