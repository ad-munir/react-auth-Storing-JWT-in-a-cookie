/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import './App.css'
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoZWxsb0BtYWltLmNvbSIsImV4cCI6MTY5NzgxODExNSwiaWF0IjoxNjk2ODY5MDQ4fQ.fWeMh5C5BFFUwFV_KxLrKlp5O59YCIkFQgYHs7BWr_s"

function App() {
  const [user, setUser] = useState(null);

  const cookies = new Cookies();

  const logout = () => {
    cookies.remove('auth_token');
    setUser(null);
  }

  const login = (token) => {
    // Decode the JWT token
    const decoded = jwtDecode(token);

    if (decoded.iat > decoded.exp) {
      console.log('Token is expired');
      return;
    }

    // Set the user state
    setUser({ email: decoded.sub });

    // Set the token in cookies
    cookies.set('auth_token', token, {
      expires: new Date(decoded.exp * 1000),
    });
  }


  useEffect(() => {
    console.log("user" + user);
    console.log("cookies auth_token " + cookies.get("auth_token"));
  }, [user]);


  useEffect(() => {
    // Check for the presence of a valid token in cookies on page load
    const token = cookies.get('auth_token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.iat <= decoded.exp) {
        setUser({ email: decoded.sub });
      }
    }
  }, []);
  

  return (
    <div className="card">
      {
        user ?
          <div>
            < h1 > Welcome {user.email}</h1 >
            <button onClick={logout}>logout </button>
          </div>

          :
          <div>
            <h1>Welcome Guest</h1>
            <button onClick={() => login(AUTH_TOKEN)}>login </button>
          </div>
      }
    </div>
  )
}

export default App
