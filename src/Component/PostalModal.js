import React, { useState } from 'react';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import db, { storage } from "../firebase";
import Firebase from "firebase/app";
import { loadingStateAction } from '../store/loadingStateSlice';





function PostalModal(props) {
    const [Textval, setTextval] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [Showimage, setShowimage] = useState(false);
    const [Showvideo, setShowvideo] = useState(false);

    const user = useSelector(state => state.userState.user);
    const dispatch = useDispatch();

    function Modalhandler() {
        props.setshowModal(false);
    }
    function handleImage(event) {
        let image = event.target.files[0];
        console.log(image);
        if (image === "" || image === undefined) {
            alert(`Not an image. This file is: ${typeof imageFile}`);
            return;
        }
        setImageFile(image);
    }

    function postArticleAPI(payload) {

        if (payload.image !== "") {
            dispatch(loadingStateAction.Setloading(true));
            const upload = storage.ref(`images/${payload.image.name}`).put(payload.image);
            upload.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (err) => alert(err),
                async () => {
                    const downloadURL = await upload.snapshot.ref.getDownloadURL();
                    db.collection("articles").add(
                        {
                            actor: {
                                description: payload.user.email,
                                title: payload.user.displayName,
                                date: payload.timestamp,
                                image: payload.user.photoURL,
                            },
                            video: payload.video,
                            sharedImg: downloadURL,
                            likes: {
                                count: 0,
                                whoLiked: [],

                            },
                            comments: {
                                count: 0,
                                whoWhatComment: [],

                            },
                            description: payload.description,
                        });
                    dispatch(loadingStateAction.Setloading(false));
                }
            );

        }

        else if (payload.video) {
            dispatch(loadingStateAction.Setloading(true));
            db.collection("articles").add({
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.timestamp,
                    image: payload.user.photoURL,
                },
                video: payload.video,
                sharedImg: "",
                likes: {
                    count: 0,
                    whoLiked: [],
                },
                comments: {
                    count: 0,
                    whoWhatComment: [],

                },
                description: payload.description,
            })
            dispatch(loadingStateAction.Setloading(false));


        }

        else if (payload.image === "" && payload.video === "") {
            dispatch(loadingStateAction.Setloading(true));
            db.collection("articles").add({
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.timestamp,
                    image: payload.user.photoURL,
                },
                video: "",
                sharedImg: "",
                likes: {
                    count: 0,
                    whoLiked: [],
                },
                comments: {
                    count: 0,
                    whoWhatComment: [],

                },
                description: payload.description,
            });
            dispatch(loadingStateAction.Setloading(false));

        }

    }

    function postArticle(event) {
        event.preventDefault();


        if (event.target !== event.currentTarget) {
            return;
        }

        const payload = {
            image: imageFile,
            video: videoFile,
            description: Textval,
            user: user,
            timestamp: Firebase.firestore.Timestamp.now(),
        };

        setTextval("");

        postArticleAPI(payload);
        props.setshowModal(false);



    }

    return (
        <>
            {props.showModal && <Container>
                <Content>
                    <Header>
                        <h2>Create a post</h2>
                        <button onClick={Modalhandler}>
                            <img src="/images/close-icon.svg" alt="" />
                        </button>
                    </Header>
                    <SharedContent>
                        <UserInfo>
                            {user?.uid ? <img src={user.photoURL} alt="" /> : <img src="/images/user.svg" alt="" />}
                            {user?.displayName ? <span>{user?.displayName}</span> : <span> Name</span>}
                        </UserInfo>
                        <Editor>

                            <textarea
                                value={Textval}
                                onChange={(e) => setTextval(e.target.value)}
                                placeholder="Type anything which you want to post"
                                autoFocus={true}

                            />
                            {Showimage && <UploadImage>
                                <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="imageFile" onChange={handleImage} style={{ display: "none" }} />
                                <p>
                                    <label htmlFor="imageFile">Click Me To Upload Image</label>
                                </p>
                                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="" />}
                            </UploadImage>}

                            {Showvideo && <>
                                <input
                                    type="text"
                                    name="video"
                                    id="videoFile"
                                    value={videoFile}
                                    placeholder="Enter the video link"
                                    onChange={(event) => setVideoFile(event.target.value)}
                                />
                                {videoFile && <ReactPlayer width={"100%"} url={videoFile} />}
                            </>}


                        </Editor>
                    </SharedContent>

                    <ShareCreation>
                        <AttachAsset>
                            <AssetButton >
                                <img src="/images/share-image.svg" alt="" onClick={() => { setShowimage(true); setShowvideo(false) }} />
                            </AssetButton>
                            <AssetButton >
                                <img src="/images/share-video.svg" alt="" onClick={() => { setShowimage(false); setShowvideo(true) }} />
                            </AssetButton>
                        </AttachAsset>
                        <ShareComment>
                            <AssetButton>
                                <img src="/images/share-comment.svg" alt="" />
                                <span>Anyone</span>
                            </AssetButton>
                        </ShareComment>
                        <PostButton disabled={!Textval ? true : false} onClick={(event) => postArticle(event)}>
                            Post
                        </PostButton>
                    </ShareCreation>
                </Content>
            </Container>}
        </>
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
	margin: 0 auto;
    overflow-y: auto;
`;

const Header = styled.div`
	display: block;
	padding: 10px 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.15);
	font-size: 20px;
	line-height: 1.5;
	color: rgba(0, 0, 0, 0.9);
	display: flex;
	justify-content: space-between;
	align-items: center;
	h2 {
		font-weight: 400;
	}
	button {
		width: 40px;
		height: 40px;
		min-width: auto;
		border: none;
		outline: none;
		background: transparent;
		img,
		svg {
			pointer-events: none;
		}
	}
`;

const SharedContent = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-y: scroll;
	vertical-align: baseline;
	background: transparent;
	padding: 5px 12px;
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	padding: 10px 24px;
	img {
		width: 48px;
		height: 48px;
		background-clip: content-box;
		border-radius: 50%;
		border: 2px solid transparent;
	}
	span {
		font-weight: 600;
		font-size: 16px;
		line-height: 1.5;
		margin-left: 9px;
	}
`;

const ShareCreation = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 24px 10px 16px;
`;

const AttachAsset = styled.div`
	display: flex;
	align-items: center;
`;

const AssetButton = styled.button`
	display: flex;
	align-items: center;
	height: 40px;
	min-width: auto;
	margin-right: 8px;
	border-radius: 50%;
	border: none;
	outline: none;
	justify-content: center;
	background: transparent;
	&:hover {
		background: rgba(0, 0, 0, 0.08);
	}
`;

const ShareComment = styled.div`
	padding-left: 8px;
	margin-right: auto;
	border-left: 1px solid rgba(0, 0, 0, 0.08);
	${AssetButton} {
		border-radius: 50px;
		padding: 5px 10px;
		span {
			font-size: 16px;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.6);
			padding: 0 5px;
		}
	}
`;

const PostButton = styled.button`
	min-width: 60px;
	padding: 0 16px;
	border-radius: 20px;
	background: ${(props) => (props.disabled ? "#b8b8b8" : "#0a66c2")};
	color: ${(props) => (props.disabled ? "#5a5a5a" : "#fff")};
	font-size: 16px;
	letter-spacing: 1.1px;
	border: none;
	outline: none;
	&:hover {
		background: ${(props) => (props.disabled ? "#b8b8b8" : "#004182")};
	}
`;

const Editor = styled.div`
	padding: 12px 24px;
	textarea {
		width: 100%;
		min-height: 100px;
		resize: none;
	}
	input {
		width: 100%;
		height: 35px;
		font-size: 16px;
		margin-bottom: 20px;
	}
`;

const UploadImage = styled.div`
	text-align: center;
	img {
		width: 100%;
	}
    p{
        margin-top: 5px;
    }
    label{
        color: red;
        &:hover{
            color: blue;
        }
    }
`;


export default PostalModal;