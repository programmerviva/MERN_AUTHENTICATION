import "../styles/Instructor.css";
import instructorImage from "../assets/profile.png";

const Instructor = () => {
  return (
    <div className="instructor-page">
      <div className="instructor-card">
        <div className="instructor-image">
          <img src={instructorImage} alt="Instructor" />
        </div>
        <div className="instructor-info">
          <h1>Muhammad Zeeshan Khan</h1>
          <h4>Your Instructor</h4>
          <p>
            Hello! I am Vikas Vaibhav, a passionate software engineer
            with a love for tech and building scalable, robust applications.
            With years of experience in JavaScript, React, Node.js, Express, and
            MongoDB, I am dedicated to helping companies stable and grow their
            net-worth. Join me in your company to grow your company.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/programmerviva"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vikasvaibhav"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/channel/programmerviva"
              target="_blank"
              rel="noopener noreferrer"
            >
              Youtube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
