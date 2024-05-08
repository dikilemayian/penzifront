/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

// Navbar component
const Navbar = () => {
  return (
    <nav>
      <h1>Penzi</h1>
    </nav>
  );
};

// Header component
const Header = () => {
  return (
    <header>
      <h2>Welcome to Penzi</h2>
      <p>Find your perfect match!</p>
    </header>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 Penzi</p>
    </footer>
  );
};

// Main Penzi component
function Penzi() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    msisdn: '',
    message_content: '',
    name: '',
    age: '',
    gender: '',
    county: '',
    town: '',
    level_of_education: '',
    profession: '',
    marital_status: '',
    religion: '',
    ethnicity: '',
    description: '',
    age_range_str: '',
    location: '',
    matchGender: '',
  });
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let message_content = '';
    let msisdn = formData.msisdn;
    switch (step) {
      case 1:
        message_content = formData.message_content;
        break;
      case 2:
        message_content = `start#${formData.name}#${formData.age}#${formData.gender}#${formData.county}#${formData.town}`;
        break;
      case 3:
        message_content = `details#${formData.level_of_education}#${formData.profession}#${formData.marital_status}#${formData.religion}#${formData.ethnicity}`;
        break;
      case 4:
        message_content = `MYSELF ${formData.description}`;
        break;
      case 5:
        message_content = `match#${formData.age_range_str}#${formData.location}#${formData.matchGender}`;
        break;
      default:
        break;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/receive-message/', { msisdn, message_content });
      alert("Response from the API: " + JSON.stringify(response.data));
      if (response.status === 200) {
        nextStep();
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred while submitting your information. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      if (step === 6 && formData.msisdn !== '' && matches.length === 0) {
        try {
          const msisdn = formData.msisdn;
          const response = await axios.get('http://127.0.0.1:8000/receive-message/', {
            params: { msisdn }
          });
    
          console.log('Response data:', response.data);
    
          if (response.data.hasOwnProperty('matches')) {
            const matchesString = response.data.matches;
            if (matchesString && typeof matchesString === 'string') {
              if (matchesString.includes('No potential matches found.')) {
                setMatches([]);
              } else {
                const matchesData = matchesString.split(',').map(match => match.trim());
                
                console.log('Matches Data:', matchesData);
                
                const newMatches = matchesData.filter(match => match !== '').map(match => {
                  // Here you need to implement your logic to extract the relevant information from each match
                  // This might involve further splitting or pattern matching based on the actual format of the matches
                  return { name: match }; // For now, just storing the name as an example
                });
                
                setMatches(newMatches);
              }
            } else {
              console.error('Invalid response format:', response.data);
            }
          } else {
            console.error('Invalid response format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      }
    };
  
    fetchMatches();
  
  }, [step, formData.msisdn, matches.length]);
  
  
  

  const fetchMoreMatches = async () => {
    try {
      const msisdn = formData.msisdn;
      const response = await axios.get('http://127.0.0.1:8000/receive-message/', {
        params: { msisdn, page: currentPage + 1 }
      });

      if (Array.isArray(response.data)) {
        setMatches(prevMatches => [...prevMatches, ...response.data]);
        setCurrentPage(prevPage => prevPage + 1);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching more matches:', error);
    }
  };

  const renderLoadMoreButton = () => {
    return (
      <button onClick={fetchMoreMatches}>Load Next</button>
    );
  };

  const renderMatches = () => {
    return (
      <div className="section">
        <h2>Received Matches</h2>
        <div className="matches-container">
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <div key={index} className="match">
                <p>Name: {match.name}</p>
                <p>Age: {match.age}</p>
                <p>MSISDN: {match.msisdn}</p>
              </div>
            ))
          ) : (
            <p>No matches found.</p>
          )}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="section">
            <h2>Account Activation</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="msisdn">Mobile Number:</label><br />
              <input type="text" id="msisdn" name="msisdn" value={formData.msisdn} onChange={handleChange} /><br />

              <label htmlFor="message_content">Message Content:</label><br />
              <input type="text" id="message_content" name="message_content" value={formData.message_content} onChange={handleChange} /><br />

              <button type="submit">Next</button>
            </form>
          </div>
        );
      case 5:
        return (
          <div className="section">
            <h2>Find your Match</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="msisdn">Mobile Number:</label><br />
              <input type="text" id="msisdn" name="msisdn" value={formData.msisdn} onChange={handleChange} /><br />
              <label htmlFor="age_range_str">Enter your match age range from-to:</label><br />
              <input type="text" id="age_range_str" name="age_range_str" value={formData.age_range_str} onChange={handleChange} /><br />

              <label htmlFor="location">Location:</label><br />
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} /><br />

              <label htmlFor="matchGender">Gender:</label><br />
              <input type="text" id="matchGender" name="matchGender" value={formData.matchGender} onChange={handleChange} /><br />

              <button type="submit">Next</button>
            </form>
          </div>
        );

      case 6:
        return (
          <div>
            <button onClick={prevStep} className="back-button">Back</button>
            {renderMatches()}
            {renderLoadMoreButton()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="container">
        <div className="tabs">
          <button className={step === 1 ? 'active' : ''} onClick={() => setStep(1)}>Account Activation</button>
          <button className={step === 5 ? 'active' : ''} onClick={() => setStep(5)}>Find Matches</button>
        </div>
        {renderStep()}
      </div>
      <Footer />
    </div>
  );
}

export default Penzi;
*/