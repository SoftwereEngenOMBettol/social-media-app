import Posts from "./Posts";
import SharePosts from "./SharePost";
import User from "./User";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const Home = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.users.user?.email);


useEffect(() => {
    if (!email) {
      navigate("/login");
    } 
  }, [email, navigate]);
    
  return (
    <Container>
      <Row>
        <Col md={3}>
          <User />
        </Col>

        <Col md={9}>
          <SharePosts />
        </Col>
      </Row>

      <Row>
        <Col md={3}></Col>
        <Col md={9}>
          <Posts />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
