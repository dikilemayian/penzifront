import React from 'react';
import './dashboard.css'; // Import the CSS file

class PenziDashboard extends React.Component {
  render() {
    return (
      <div className="dashboard">
        <header className="header">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <div className="logo">
          <img src="/penzi.jpeg" alt="Penzi Logo" />
          
        </div>
          <nav className="navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#messages">Messages</a></li>
              <li><a href="#profile">Profile</a></li>
              <li><a href="#matches">Matches</a></li>
              <li><a href="#settings">Settings</a></li>
              <li><a href="#logout">Logout</a></li>
            </ul>
          </nav>
        </header>
        <main className="main-content">
          <section id="home" className="dashboard-section">
            <h2>Home</h2>
            {/* Home section content */}
          </section>
          <section id="messages" className="dashboard-section">
            <h2>Messages</h2>
            {/* Messages section content */}
          </section>
          <section id="profile" className="dashboard-section">
            <h2>Profile</h2>
            {/* Profile section content */}
          </section>
          <section id="matches" className="dashboard-section">
            <h2>Matches</h2>
            {/* Matches section content */}
          </section>
          <section id="settings" className="dashboard-section">
            <h2>Settings</h2>
            {/* Settings section content */}
          </section>
          <section id="logout" className="dashboard-section">
            <h2>Logout</h2>
            {/* Logout section content */}
          </section>
        </main>
        <footer className="footer">
          <p>&copy; 2024 Penzi. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default PenziDashboard;
