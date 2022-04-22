import React from 'react';
import './chat.css'; // Import css modules stylesheet as styles;
import SignOut from './SignOut';
import ChatRoom from './ChatRoom';
import Header from '../Header';


function Chat() {
    return (
        <>
            <div className='chatdiv'>
                <Header active="activeHeader" ></Header>

                <div className="chat">

                    {/* <header>
                        <h1>⚛️ 🔥 💬</h1>
                        <SignOut />
                    </header> */}

                    <section>
                        <ChatRoom />
                    </section>

                </div>
            </div>
        </>

    )
}

export default Chat;