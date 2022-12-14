import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/About";
import Alert from "./components/Alert";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import NoteState from "./context/notes/NoteState";

function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type
    });
    setTimeout(()=>{
      setAlert(null);
    }, 1500)
  }

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <Switch>
          <Route exact path="/">
            <Home showAlert={showAlert} />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/login">
            <Login showAlert={showAlert} />
          </Route>
          <Route exact path="/signup">
            <SignUp showAlert={showAlert} />
          </Route>
        </Switch>
      </Router>
    </NoteState>
  );
}

export default App;
