import { Avatar, Icon, IconButton } from '@material-ui/core';
import { InsertEmoticon, Send } from '@material-ui/icons';
import AttachFileIcon from '@material-ui/icons/AttachFile';
// import MicIcon from '@material-ui/icons/Mic';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import firebase from 'firebase';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import TimeAgo from 'timeago-react';
import Message from './Message';
import { auth, firestore } from '../../firebase/firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

const ChatScreen = ({ chat, messages }) => {
  const [message, setMessage] = useState('');
  const endOfMessagesRef = useRef(null);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const chatId = router.query.id;
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [messagesSnapshot] = useCollection(
    firestore
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );
  const [recipientSnapshot] = useCollection(
    firestore.collection('users').where('email', '==', recipientEmail)
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sendMesssage = (e) => {
    e.preventDefault();

    // update last seen
    firestore.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Save message data
    firestore.collection('chats').doc(chatId).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message,
      user: user.email,
      photoURL: user.photoURL,
    });

    setMessage('');
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          {/* <IconButton>
            <MoreVertIcon />
          </IconButton> */}
        </HeaderIcons>
        <UserAvatar 
          onClick={() => auth.signOut()}
          src={user.photoURL} 
        />
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessages ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <Input onChange={(e) => setMessage(e.target.value)} value={message} />
        <button hidden disabled={!message} type='submit' onClick={sendMesssage}>
          Send Message
        </button>
        <IconButton disabled={!message} type='submit' onClick={sendMesssage}>
          <Send />
        </IconButton>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  flex: 1;
  margin-left: 15px;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  background-color: #e5ded8;
  padding: 30px;
  min-height: 90vh;
`;
const EndOfMessages = styled.div`
  margin-bottom: 50px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  margin-right: 4px;
  margin-left: 4px;
  :hover {
    opacity: 0.8;
  }
`;