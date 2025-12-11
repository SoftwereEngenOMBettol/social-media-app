// Components/Footer.js

import About from "./About";


const Footer = () => {
 

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-text">
          <span> SocialApp - Connect with friends and share your moments</span>
        </div>
        <div className="footer-copyright">
          <span>© 2025 SocialApp. All rights reserved.</span>
        </div>
       <About />
      </div>
    </footer>
  );
};

export default Footer;