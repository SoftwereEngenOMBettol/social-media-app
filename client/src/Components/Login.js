// Components/Login.js
import { Container, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap'; 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { login, clearError } from '../Features/UserSlice';
import { useNavigate } from 'react-router-dom';
import logo from "../Images/big-logo.png"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserID = useSelector((state) => state.users.user?.id);

  
  // Get state from Redux
  const { isSuccess, isError, isLoading, error, isAuthenticated } = useSelector((state) => state.users);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess || isAuthenticated) {
      console.log("Successful login");
      navigate("/posts");
    }
  }, [isSuccess, isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const userData = {
        email: email.trim(),
        password: password
      };
      dispatch(login(userData));
    } catch (error) {
      console.log("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <div className="login-box">
          <Form className="login-form" onSubmit={handleSubmit}>
            <Row className="justify-content-center">
              <Col md={4} className="text-center">
                <img src={logo} alt='logo' className="logo-image"/>
                <p className="login-subtitle">Welcome back to our life...</p>
              </Col>
            </Row>

            {/* Show error message */}
            {isError && (
              <Row className="justify-content-center">
                <Col md={4}>
                  <div className="error-message">
                    {error?.error || error?.message || "Login failed. Please check your credentials."}
                  </div>
                </Col>
              </Row>
            )}

            {/* Show loading */}
            {isLoading && (
              <Row className="justify-content-center">
                <Col md={4}>
                  <div className="loading-message">Logging in...</div>
                </Col>
              </Row>
            )}

            <Row className="justify-content-center">
              <Col md={4}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input 
                    id='email' 
                    name="email"
                    placeholder="Enter your email"
                    type="email" 
                    className='login-input' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <FormGroup>  
                  <Label for="password">Password</Label>
                  <Input 
                    id='password' 
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    type="password" 
                    className='login-input'
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </FormGroup>  
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <Button 
                  className="login-button" 
                  type='submit' 
                  disabled={isLoading}
                  block
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        <Row className="justify-content-center">
          <Col md={4}>
            <div className="signup-redirect">
              <p className="signup-text">
                Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>   
    </div>
  );
};

export default Login;