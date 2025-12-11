import { Container, Col, Row, Button } from 'reactstrap'; 
import { userSchemaValdition } from '../Validations/UserValidations';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, clearError } from '../Features/UserSlice';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  
  const navigate = useNavigate();
  const { isLoading, isError, error } = useSelector((state) => state.users);
  // Create the state variables
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValdition),
  });



  const onSubmit = async (data) => {
    try {
      dispatch(clearError());
      
      const result =  dispatch(registerUser({
        name: data.name,
        email: data.email,
        password: data.password 
      }));

      if (registerUser.fulfilled.match(result)) {
        alert("Registration successful!");
        navigate('/posts');
      } else {
        alert(result.payload?.error || "Registration failed!");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="register-container">
      {isLoading && <div>Loading...</div>}
      {isError && <div className="error-message">{error?.error}</div>}
      <Container>
        <div className="register-box">
          <form className="register-form" onSubmit={handleSubmit(onSubmit)}> 
            <Row className="justify-content-center">
              <Col md={4} className="text-center">
                <h2 className="app-title">Your App Name</h2>
                <p className="signup-subtitle">Sign up to see photos and videos from your friends.</p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={4}>
                <input 
                  id='email' 
                  name="email"
                  placeholder="Mobile Number or Email"
                  type="email" 
                  className='register-input' 
                  value={email}
                  {...register("email",{
                    onChange: (e) => setemail(e.target.value),
                  })} 
                />
                <p className="error-message">{errors.email?.message}</p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <input 
                  id='name' 
                  name="name"
                  placeholder="Full Name"
                  type="text" 
                  className='register-input' 
                  value={name}
                  {...register("name",{
                    onChange: (e) => setname(e.target.value),
                  })} 
                />
                <p className="error-message">{errors.name?.message}</p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <input 
                  id='password' 
                  name="password"
                  placeholder="Password"
                  value={password}
                  type="password" 
                  className='register-input' 
                  {...register("password",{
                    onChange: (e) => setpassword(e.target.value),
                  })}
                />
                <p className="error-message">{errors.password?.message}</p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <input 
                  id='Re_password' 
                  name="Re_password"
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  type="password" 
                  className='register-input' 
                  {...register("Re_password",{
                    onChange: (e) => setconfirmPassword(e.target.value),
                  })}
                />
                <p className="error-message">{errors.Re_password?.message}</p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <p className="privacy-notice">
                  People who use our service may have uploaded your contact information to Instagram. <a href="/learn-more" className="learn-more">Learn More</a>
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <p className="terms-notice">
                  By signing up, you agree to our <a href="/terms" className="terms-link">Terms</a>, <a href="/privacy" className="terms-link">Privacy Policy</a> and <a href="/cookies" className="terms-link">Cookies Policy</a>.
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <Button className="signup-button" type='submit'>Sign up</Button>
              </Col>
            </Row>
          </form>
        </div>

        <Row className="justify-content-center">
          <Col md={4}>
            <div className="login-redirect">
              <p className="login-text">
                Have an account? <Link to="/login" className="login-link">Log in</Link>
              </p>
            </div>
          </Col>
        </Row>


      </Container>   
    </div>
  );
};

export default Register;