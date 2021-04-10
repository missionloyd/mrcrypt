import { Avatar, Button, IconButton, Typography } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { firestore, auth } from '../../firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import { ArrowBackIosRounded, MoreVert } from '@material-ui/icons';

function Sidebar() {

  const [user] = useAuthState(auth);
  const userChatRef = firestore.collection('chats').where('users', 'array-contains', user.email);
  const [chatsSnapShot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter a user email you wish to chat with"
    );

    if (!input) return null;

    if (
      !chatAlreadyExists(input) && 
      input !== user.email && 
      EmailValidator.validate(input)
    ) {
      // add in chat if it already doesn't exist
      firestore.collection('chats').add({
        users: [user.email, input]
      });
    }
  }

  const chatAlreadyExists = (recipientUser) => 
    !!chatsSnapShot?.docs.find(
      (chat) => 
        chat.data().users.find((user) => user === recipientUser)?.length > 0
    );

  return (
    <Container>
      <Header>
        <BackContainer>
          <IconButton>
            <ArrowBackIosRounded />
          </IconButton>
        </BackContainer>
        <Typography>
          Community Chat
        </Typography>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {chatsSnapShot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

// Save for dashboard layout nav
const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const BackContainer = styled.div`
cursor: pointer;
`;

const Search = styled.div`
  display: flex;
  align-items: 5px;
  padding: 20px;
  border-radius: 2px;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;