import Header from "./Components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Row } from "reactstrap";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Register from "./Components/Register";
import FindFriends from "./Components/FindFriends";
import Settings from "./Components/Settings";
import MyFriends from "./Components/MyFrinds";
import Posts from "./Components/Posts";
import AddPost from "./Components/AddPost";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 
import MyPosts from "./Components/MyPost";
import About from "./Components/About";
import Location from "./Components/Location";



const App = () => {
  return (
    <Router>
      <Container fluid>
         <Row>
    
              <Header />
        
        </Row>
        <Row className="main">
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/" element={<Posts />} />
            
            {/* Protected routes with userId parameter */}
            <Route path="/settings/:user_id" element={ <Settings /> } />
            <Route path="/profile/:user_id" element={ <Profile />  } />
            <Route path="/findfriends/:user_id" element={ <FindFriends /> } />
            <Route path="/myfriends/:user_id" element ={ <MyFriends /> } />
            <Route path="/addPost/:user_id" element={<AddPost />} />
            <Route path="/my-posts/:user_id" element={<MyPosts />} />  
            <Route path="/about" element={<About />} />  
            <Route path="/location" element={<Location />} />  
          </Routes>
        </Row>
        
        <Row>
 
              <Footer />
        </Row>
      </Container>
    </Router>
  );
};

export default App;