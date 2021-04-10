import Head from 'next/head';
import styled from 'styled-components';
import { auth, googleAuthProvider } from '../firebase/firebase';

function Login() {

  const signIn = () => {
    auth.signInWithPopup(googleAuthProvider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="/spock.gif"></Logo>
        <Button variant="outlined" onClick={signIn}>Sign in with Google</Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  border-radius: 5px;
  margin-bottom: 50px;
`;

const Button = styled.button``;