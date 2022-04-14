import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import db, { storage } from "../firebase";
import Firebase from "firebase/app";
import { loadingStateAction } from '../store/loadingStateSlice';

function Editpost(props) {
    const user = useSelector(state => state.userState.user);
    const dispatch = useDispatch();
    const articles = useSelector(state => state.articleState.articles);

    const [Textval, setTextval] = useState("");
    const [imageFile, setImageFile] = useState("");//for image from Local storage
    const [videoFile, setVideoFile] = useState("");
    const [uplodedimg, setuploadedimg] = useState("")//for image from firebase url
    const [Showimage, setShowimage] = useState(false);
    const [Showvideo, setShowvideo] = useState(false);

    // console.log(editposttext);
    // console.log("Showimage,Showvideo,props.showModal", Showimage, Showvideo, props.showModal);


    const editposttext = articles[props.editpostDetail.postindex]?.description;
    const editpostvideo = articles[props.editpostDetail.postindex]?.video;
    const editpostimage = articles[props.editpostDetail.postindex]?.sharedImg;
    const editpostid = props.editpostDetail.postid;
    // console.log("editpostid", editpostid);


    useEffect(() => {

        if (editposttext && editpostvideo) {
            setShowvideo(true);
            setVideoFile(editpostvideo);
            setTextval(editposttext);
            setShowimage(false);
        }
        if (editposttext && !editpostvideo && !editpostimage) {
            setTextval(editposttext);
            setShowimage(false);
            setShowvideo(false);
            setVideoFile("")
        }
        if (editposttext && editpostimage) {
            setTextval(editposttext);
            setuploadedimg(editpostimage);
            setShowimage(true);
            setShowvideo(false);
        }
    }, [editposttext, editpostvideo, editpostimage])

    // console.log("editposttext,editpostvideo,editpostimage", editposttext, editpostvideo, editpostimage);

    // console.log("editposttext", editposttext);
    // console.log("articles[props.editpostDetail.postindex]", articles[props.editpostDetail.postindex]);
    function updateArticleAPI(payload) {
        db.collection("articles").doc(payload.id).update(payload.update);
    }

    function imagebunhandler() {
        // props.setshowModal(false);

        setShowvideo(false);
        setVideoFile("");
        setShowimage(true)

    }
    function Modalhandler() {
        props.setshowModal(false);
        // setTextval("");
        // setImageFile("");
        // setVideoFile("");

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
    function postArticle(event) {
        event.preventDefault();

        if (event.target !== event.currentTarget) {
            return;
        }

        if (imageFile && !videoFile) {
            dispatch(loadingStateAction.Setloading(true));
            const upload = storage.ref(`images/${imageFile.name}`).put(imageFile);
            upload.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (err) => alert(err),
                async () => {
                    const downloadURL = await upload.snapshot.ref.getDownloadURL();

                    const payload = {
                        update: {
                            description: Textval,
                            sharedImg: downloadURL,
                            video: ""
                        },
                        id: editpostid,
                    }

                    updateArticleAPI(payload);
                    dispatch(loadingStateAction.Setloading(false));
                }
            );











        }

        if (!imageFile && videoFile) {
            const payload = {
                update: {
                    description: Textval,
                    video: videoFile,
                    sharedImg: "",
                },
                id: editpostid,
            }
            updateArticleAPI(payload);
        }
        if (!imageFile && !videoFile && Textval) {

            const payload = {
                update: {
                    description: Textval,
                    sharedImg: "",
                    video: ""

                },
                id: editpostid,
            }
            updateArticleAPI(payload);
        }



        setTextval("");
        setImageFile("");
        setVideoFile("");


        // postArticleAPI(payload);
        props.setshowModal(false);



    }

    return (
        <>
            {props.showModal && <Container>
                {console.log("runnnnnn")}
                <Content>
                    <Header>
                        <h2>Edit a post</h2>
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
                                    <label htmlFor="imageFile">Click Me To Upload New Image</label>
                                </p>

                                {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="" /> : (uplodedimg && <img src={uplodedimg} alt="" />)}


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
                                <img src="/images/share-image.svg" alt="" onClick={() => { imagebunhandler() }} />
                            </AssetButton>
                            <AssetButton >
                                <img src="/images/share-video.svg" alt="" onClick={() => { setShowimage(false); setShowvideo(true); setImageFile(""); }} />
                            </AssetButton>
                        </AttachAsset>
                        <ShareComment>
                            <AssetButton>
                                <img src="/images/share-comment.svg" alt="" />
                                <span>Anyone</span>
                            </AssetButton>
                        </ShareComment>
                        <PostButton disabled={!Textval ? true : false} onClick={(event) => postArticle(event)}>
                            Edit
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
	background-color: rgba(0, 0, 0, 0.5);
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
        color: #0a66c2;
        &:hover{
            color: #004182;
        }
    }
`;


export default Editpost;