
import React, {
	useState, useEffect, useRef
} from 'react';
import db, { auth, provider, storage } from "../firebase";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { articleStateAction } from '../store/articleStateSlice';
import PostalModal from "./PostalModal";
import ReactPlayer from 'react-player';
import LikeCommentModal from './LikeCommentModal';
import Editpost from './Editpost';
// import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';


function Main() {
	//Normal page State
	const [showModal, setshowModal] = useState(false)
	const [showcmt, setshowcmt] = useState({ id: "", isshow: false });
	const [clickedpostdata, setclickedpostdata] = useState({ postid: "", postindex: "" });
	const [showConfirmModal, setshowConfirmModal] = useState({ postid: "", show: false });
	const [showeditmodal, setshoweditmodal] = useState(false);
	const [Editpostinfo, setEditpostinfo] = useState({ postid: "", postindex: "" })
	const comment = useRef();
	const [lastVisible, setlastVisible] = useState({})

	//Like&Comments modal  State
	const [showLikeCmtmodal, setshowLikecmtmodal] = useState(false);
	const [isLikesection, setisLikesection] = useState(false);
	const [iscmtsection, setiscmtsection] = useState(false);

	//poststate 

	const [posthandel, setposthandel] = useState({ id: "", isshow: false });

	//Redux Store Values
	const usedata = useSelector(state => state.userState.user)
	const loading = useSelector(state => state.loadingState.loading);
	const articles = useSelector(state => state.articleState.articles);
	const id = useSelector(state => state.articleState.ids);


	//dispatch
	const dispatch = useDispatch();

	//Paginations
	const [limit, setlimit] = useState(5);
	const [hasMore, sethasMore] = useState(true);
	const [TotalDoc, setTotalDoc] = useState();


	useEffect(() => {
		db.collection("articles").get().then(function (querySnapshot) {
			setTotalDoc(querySnapshot.docs.length);
			// console.log("length", querySnapshot.docs.length);
		});
	}, [])
	useEffect(() => {
		getArticlesAPI();
	}, [limit])


	function getArticlesAPI() {

		let payload;
		let id;
		db.collection("articles")
			.orderBy("actor.date", "desc")
			.limit(limit)
			.onSnapshot((snapshot) => {
				// console.log("useeffect run");
				var size = snapshot.size
				// console.log(size);
				// var lastVisibl = snapshot.docs[snapshot.docs.length - 1];
				// setlastVisible(lastVisibl)

				payload = snapshot.docs.map((doc) => doc.data());
				payload = JSON.parse(JSON.stringify(payload))
				// console.log(payload);
				id = snapshot.docs.map((doc) => doc.id);
				// console.log(id);
				dispatch(articleStateAction.GET_ARTICLES({ articles: payload, ids: id }))
				// dispatch(getArticles(payload, id));
			});
		// dispatch(setLoading(false));

	}


	function resetState() {
		setisLikesection(false);
		setiscmtsection(false);
	}

	function Modalhandler() {
		setshowModal(true);
	}
	function updateArticleAPI(payload) {
		db.collection("articles").doc(payload.id).update(payload.update);
	}
	function arrayRemove(arr, value) {

		return arr.filter(function (ele) {
			return ele != value;
		});
	}

	function likehandeler(event, postid, postindex) {
		event.preventDefault();
		// console.log(articles);
		let currentLikes = articles[postindex].likes.count
		let whoLiked = articles[postindex].likes.whoLiked;

		let useremail = { email: usedata.email, name: usedata.displayName, image: usedata.photoURL };

		let userIndex = whoLiked.findIndex(element => {
			if (element.email === useremail.email) {
				return true;
			}
		});

		// console.log(event, currentLikes, postid, postindex, whoLiked, useremail, userIndex);

		if (userIndex >= 0) {
			currentLikes--;
			// whoLiked.splice(userIndex, 1);

			var filtered = arrayRemove(whoLiked, whoLiked[userIndex]);

			whoLiked = [...filtered];


		} else if (userIndex === -1) {
			currentLikes++;
			// whoLiked.push(useremail);
			whoLiked = [...whoLiked, useremail]
		}

		const payload = {
			update: {
				likes: {
					count: currentLikes,
					whoLiked: whoLiked,
				},
			},
			id: postid,
		}
		updateArticleAPI(payload)

	}

	function CommentpostHandeler(event, postid, postindex) {
		event.preventDefault();
		let postcomment = comment.current['cmt'].value;
		if (postcomment) {
			console.log("postid, postindex,postcomment", postid, postindex, postcomment);

			let currentcmt = articles[postindex].comments.count;
			let whoWhatComment = articles[postindex].comments.whoWhatComment;

			let newcmt = { name: usedata.displayName, image: usedata.photoURL, cmt: postcomment }


			console.log("currentcmt,whoWhatComment,newcmt,articles[postindex]", currentcmt, whoWhatComment, newcmt, articles[postindex]);


			currentcmt++;
			whoWhatComment = [...whoWhatComment, newcmt];

			const payload = {
				update: {
					comments: {
						count: currentcmt,
						whoWhatComment: whoWhatComment,
					},
				},
				id: postid,
			}
			updateArticleAPI(payload);

			comment.current['cmt'].value = "";
			setclickedpostdata({ postid: postid, postindex: postindex })
			resetState();
			setiscmtsection(true);
			//timeout
			setTimeout(() => {
				setshowLikecmtmodal(true);
			}, 200);
		}
		return;
		// console.log(postcomment);

	}

	function commenthandeler(e, postid, postindex) {
		e.preventDefault();

		setshowcmt((pre) => {

			return (pre?.id == postid) ? {
				id: postid,
				isshow: !pre?.isshow
			} : {
				id: postid,
				isshow: true
			}

		});

	}

	function likecmtmodalhandler(event, postid, postindex, setsection) {
		event.preventDefault();
		console.log("event,postid,postindex", event, postid, postindex);

		//Show modal
		setshowLikecmtmodal(true);
		setclickedpostdata({ postid: postid, postindex: postindex })

		//Reset old state
		resetState();

		//Show modal with clicked section
		setsection(true);

	}

	function updatepost(postid) {
		setposthandel((pre) => {

			if (pre?.id == postid) {
				return {
					id: postid,
					isshow: !pre?.isshow
				}
			}
			else {
				return {
					id: postid,
					isshow: true
				}
			}

		});
		// db.collection("articles").doc(postid).delete();
	}

	function confirmdelete(postid) {
		setshowConfirmModal({ postid: postid, show: true });
		setposthandel((pre) => {

			return (pre?.id == postid) ? {
				id: postid,
				isshow: !pre?.isshow
			} : {
				id: postid,
				isshow: true
			}

		});
	}

	function deletepost() {
		db.collection("articles").doc(showConfirmModal.postid).delete();
		setshowConfirmModal(false);
	}

	function editpostmodalhandeler(postid, postindex) {
		// console.log("postid,postindex,article,user", postid, postindex, articles, usedata);


		//Optional Check already hide edit button in jsx
		if (articles[postindex].actor.description === usedata.email) {
			setEditpostinfo({ postid: postid, postindex: postindex })
			setshoweditmodal((pre) => true);
		}

		else {
			alert("You can't Edit another user Post")
		};

	}

	function loadmore() {
		// e.preventDefault();
		// console.log("triggger");
		if (TotalDoc <= limit) {
			sethasMore(false);
		}
		setlimit((pre) => pre + 2);
	}


	return (

		<Container>

			{showConfirmModal?.show && <div className="modal" tabIndex="-1" role="dialog">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Are you sure? </h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setshowConfirmModal(false)}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<p> Do you want to delete post?</p>
						</div>

						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick={() => deletepost()} >Delete</button>
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setshowConfirmModal(false)}>Cancel</button>
						</div>
					</div>
				</div>
			</div>}

			{showLikeCmtmodal &&
				<LikeCommentModal
					setshowLikecmtmodal={setshowLikecmtmodal}
					clickedpostdata={clickedpostdata}
					isLiksection={isLikesection}
					iscmsection={iscmtsection}
				/>
			}
			<ShareBox>


				<div>
					{usedata?.uid ? <img src={usedata.photoURL} alt="" /> : <img src="/images/user.svg" alt="" />}
					<button onClick={Modalhandler}>
						Start a post
					</button>
				</div>

				<div>
					<button>
						<img src="/images/photo-icon.svg" alt="" />
						<span>Photo</span>
					</button>
					<button>
						<img src="/images/video-icon.svg" alt="" />
						<span>Video</span>
					</button>
					<button>
						<img src="/images/event-icon.svg" alt="" />
						<span>Event</span>
					</button>
					<button>
						<img src="/images/article-icon.svg" alt="" />
						<span>Write article</span>
					</button>
				</div>

			</ShareBox>

			<Content>
				{loading && <img src="/images/spin.gif" alt="" />}


				<InfiniteScroll
					dataLength={articles.length} //This is important field to render the next data
					next={loadmore}
					hasMore={hasMore}
					loader={<img src="/images/spin.gif" alt="" height={"30"} width="30" />}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>Yay! You have seen it all</b>
						</p>
					}

				>

					{articles.map((article, index) => {
						//Date Object TO Real Date
						const date = (new Date(article.actor.date.seconds * 1000 + article.actor.date.nanoseconds / 1000000)).toLocaleDateString();
						// Dynamic Like button class
						const btnclass = `${article.likes.whoLiked.findIndex((ele) =>
							ele.email === usedata.email
						) >= 0 ? "active" : null}`

						return (<Article key={id[index]}>
							<SharedActor>
								<a>
									<img src={article.actor.image} alt="" />
									<div>
										<span>{article.actor.title}</span>
										<span>{article.actor.description}</span>
										<span>{date}</span>
									</div>
								</a>
								<button onClick={() => updatepost(id[index])}>
									<img src="/images/ellipses.svg" alt="" />

									{(posthandel?.id === id[index]) && (posthandel?.isshow == true) && <>
										{articles[index].actor.description === usedata.email && <div onClick={() => confirmdelete(id[index])}>
											<span>Delete</span>
										</div>}
										{/* check if user allowed to edit post */}
										{articles[index].actor.description === usedata.email && <div onClick={() => editpostmodalhandeler(id[index], index)}>
											<span>Edit</span>
										</div>}
									</>}


								</button>






							</SharedActor>
							<Description>{article.description}</Description>

							{(article?.sharedImg || article.video) && <SharedImage>
								<a>
									{(article?.sharedImg && !article.video) ? <img src={article?.sharedImg} alt="" /> : <ReactPlayer width={"100%"} url={article.video}></ReactPlayer>}
								</a>
							</SharedImage>}

							<SocialCount >
								<li onClick={(e) => likecmtmodalhandler(e, id[index], index, setisLikesection)}>
									<button>
										<img src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="like" />
										<span>{article.likes.count} Likes</span>
									</button>
								</li>
								<li onClick={(e) => likecmtmodalhandler(e, id[index], index, setiscmtsection)}>
									<button>
										<img src="https://img.icons8.com/cute-clipart/16/000000/comments.png" />
										<span>{article.comments.count} Comments</span>
									</button>

								</li>
							</SocialCount>

							<SocialActions>
								<button onClick={(event) => likehandeler(event, id[index], index)} className={btnclass}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="rgba(0, 0, 0, 0.6)" width="24" height="24" focusable="false">
										<path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"></path>
									</svg>
									<span>Like</span>
								</button>
								<button onClick={(e) => commenthandeler(e, id[index], index)}>
									<img src="/images/comment-icon.svg" alt="" />
									<span>Comment</span>
								</button>
								<button>
									<img src="/images/share-icon.svg" alt="" />
									<span>Share</span>
								</button>
								<button>
									<img src="/images/send-icon.svg" alt="" />
									<span>Send</span>
								</button>
							</SocialActions>

							{/* comments */}

							{(showcmt?.id === id[index]) && (showcmt?.isshow == true) && <Comment>
								<Writecomment>
									<form onSubmit={(event) => CommentpostHandeler(event, id[index], index)} ref={comment}>
										<Commnetinput>
											<Commentimg>
												<img src={usedata.photoURL} alt="" />
											</Commentimg>

											<textarea placeholder='Write any comment' autoFocus={true} name={'cmt'} ></textarea>

											<Postcomment>
												<button type='submit'>Post</button>
											</Postcomment>

										</Commnetinput>
									</form>


								</Writecomment>

							</Comment>}


						</Article>)
					})}


				</InfiniteScroll>


			</Content>

			<Editpost
				setshowModal={setshoweditmodal}
				showModal={showeditmodal}
				editpostDetail={Editpostinfo}
			/>
			<PostalModal showModal={showModal} setshowModal={setshowModal} ></PostalModal>
		</Container>
	)
}

const Container = styled.div`
grid-area: main;
div.modal{
	display: block;
	background-color: rgba(0, 0, 0, 0.8);
}
`;

const CommonBox = styled.div`
	text-align: center;
	overflow: hidden;
	margin-bottom: 8px;
	background-color: #fff;
	border-radius: 5px;
	position: relative;
	border: none;
	box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonBox)`
	display: flex;
	flex-direction: column;
	margin: 0 0 8px;
	color: #958b7b;
	div {
		button {
			outline: none;
			color: rgba(0, 0, 0, 0.6);
			font-size: 14px;
			line-height: 1.5;
			min-height: 48px;
			display: flex;
			align-items: center;
			border: none;
			background-color: transparent;
			font-weight: 600;
		}
		&:first-child {
			display: flex;
			align-items: center;
			padding: 8px 16px;
			img {
				width: 48px;
				border-radius: 50%;
				margin-right: 8px;
			}
			button {
				margin: 4px 0;
				flex-grow: 1;
				padding-left: 16px;
				border: 1px solid rgba(0, 0, 0, 0.15);
				border-radius: 35px;
				text-align: left;
			}
		}
		&:nth-child(2) {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			padding-bottom: 4px;
			button {
				img {
					margin: 0 4px 0 -2px;
				}
			}
		}
	}
`;

const Content = styled.div`
/* overflow: auto; */
	text-align: center;
	& > img {
		width: 30px;
	}
`;

const Article = styled(CommonBox)`
	padding: 0;
	padding-bottom: 20px;
	margin: 0 0 8px;
	overflow: visible;
	border: 1px solid rgba(0,0,0,0.20);
`;

const SharedActor = styled.div`
	padding-right: 40px;
	flex-wrap: nowrap;
	padding: 12px 16px 0;
	margin-bottom: 8px;
	display: flex;
	align-items: center;
	a {
		margin-right: 12px;
		flex-grow: 1;
		overflow: hidden;
		display: flex;
		img {
			width: 48px;
			height: 48px;
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
		display: flex;
		flex-direction: column;
		justify-content: center;
        align-items: center;
	
		div{
		width: 65px;
		height: 30px;
		/* border: 1px solid red; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		margin-bottom: 5px;
		border-radius: 20%;
		&:hover{
			background-color: #e4dede;
			text-decoration: underline;
			cursor: pointer;
		}
	
		span{
			padding: 5px;
		}
		}
	}
`;

const Description = styled.div`
	padding: 0 16px;
	overflow: hidden;
	font-size: 14px;
	text-align: left;
	white-space: pre-wrap;
`;

const SharedImage = styled.div`
	margin: 8px 16px 0;
	background-color: #f9fafb;
	img {
		width: 100%;
		height: 100%;
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
		
		&:hover{
		cursor: pointer;
		text-decoration: underline;
		
	     }

		button {
			display: flex;
			border: none;
			color: rgba(0, 0, 0, 0.6);
			background: transparent;
			&:hover{
		       cursor: pointer;
			   text-decoration: underline;
		
	     }
	
			span {
				padding-left: 5px;
		
			}

		
		}
	}
`;
const SocialActions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin: 4px 12px;
	min-height: 40px;
	padding-bottom: 5px;
	/* border-bottom: 1px solid black; */
	button {
		display: inline-flex;
		align-items: center;
		padding: 8px;
		border: none;
		background: transparent;
		span {
			margin-left: 4px;
			color: rgba(0, 0, 0, 0.6);
			font-size: 14px;
		}
	}
	button.active {
		span {
			color: #0a66c2;
			font-weight: 600;
		}
		svg {
			fill: #0a66c2;
		}
	}
`;

const Comment = styled.div`
display:flex;
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








export default Main;