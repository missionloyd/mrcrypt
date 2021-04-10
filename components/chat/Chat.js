import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '../../firebase/firebase';
import styled from 'styled-components';
import getRecipientEmail from '../../utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    firestore.collection('users').where('email', '==', getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }
  // get recipient snapshot
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  //pass in users & logged in users
  const recipientEmail = getRecipientEmail(users, user);

  return(
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  &&&:hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px
`;