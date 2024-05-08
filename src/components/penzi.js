import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useTable } from 'react-table';

// navbar component
const Navbar = () => {
  return (
    <nav>
      <h1>Penzi</h1>
    </nav>
  );
};

// header component
const Header = () => {
  return (
    <header>
      <h2>Welcome to Penzi</h2>
      <p>Find your perfect match!</p>
    </header>
  );
};

// footer component
const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 Penzi</p>
    </footer>
  );
};

// MatchesTable component
const MatchesTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Phone',
        accessor: 'msisdn',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      },
      {
        Header: 'County',
        accessor: 'county',
      },
      {
        Header: 'Town',
        accessor: 'town',
      },
      {
        Header: 'Level of Education',
        accessor: 'level_of_education',
      },
      {
        Header: 'Profession',
        accessor: 'profession',
      },
      {
        Header: 'Marital Status',
        accessor: 'marital_status',
      },
      {
        Header: 'Religion',
        accessor: 'religion',
      },
      {
        Header: 'Ethnicity',
        accessor: 'ethnicity',
      },
      {
        Header: 'Description',
        accessor: 'description',
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="matches-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <td {...column.getHeaderProps()}>{column.render('Header')}</td>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// main Penzi component
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
      alert(JSON.stringify(response.data));
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
            if (matchesString && typeof (matchesString) === 'string') {
              if (matchesString.includes('No potential matches found.')) {
                setMatches([]);
              } else {
                const matchesData = matchesString.split(',').map(match => match.trim());
                

                console.log('Matches Data:', matchesData);

                  const extractMatchInfo = (match) => {
                    const namePattern = /^[A-Za-z,\s]+/;
                    const agePattern = /Aged:\s*(\d+)/;
                    const genderPattern = /Gender:\s*([A-Za-z\s]+)/;
                    const countyPattern = /County:\s*([A-Za-z\s]+)/;
                    const townPattern = /Town:\s*([A-Za-z\s]+)/;
                    const msisdnPattern = /MSISDN:\s*(\d+)/;
                    const level_of_educationPattern = /Level of Education:\s*([A-Za-z\s]+)/;
                    const professionPattern = /Profession:\s*([A-Za-z\s]+)/;
                    const marital_statusPattern = /Marital Status:\s*([A-Za-z\s]+)/;
                    const religionPattern = /Religion:\s*([A-Za-z\s]+)/;
                    const ethnicityPattern = /Ethnicity:\s*([A-Za-z\s]+)/;
                    const descriptionPattern = /Description:\s*([A-Za-z\s,]+)/;
                
                
              
                  
                    const nameMatch = match.match(namePattern);
                    const name = nameMatch ? nameMatch[0].trim() : '';
  
                    const ageMatch = match.match(agePattern);
                    const age = ageMatch ? ageMatch[1] : '';
  
                    const msisdnMatch = match.match(msisdnPattern);
                    const msisdn = msisdnMatch ? msisdnMatch[1].trim(): '';
  
                    const genderMatch = match.match(genderPattern)
                    const gender = genderMatch ? genderMatch[1] : '';
  
                    const countyMatch = match.match(countyPattern)
                    const county = countyMatch ? countyMatch[1] : '';
  
                    const townMatch = match.match(townPattern)
                    const town = townMatch ? townMatch[1]: '';
  
                    const level_of_educationMatch = match.match(level_of_educationPattern)
                    const level_of_education = level_of_educationMatch ? level_of_educationMatch[1]: '';
  
                    const professionMatch = match.match(professionPattern)
                    const profession = professionMatch ? professionMatch[1]: '';
  
                    const marital_statusMatch = match.match(marital_statusPattern)
                    const marital_status = marital_statusMatch ? marital_statusMatch[1] : '';
  
                    const religionMatch = match.match(religionPattern)
                    const religion = religionMatch ? religionMatch[1] : '';
  
                    const ethnicityMatch = match.match(ethnicityPattern)
                    const ethnicity = ethnicityMatch ? ethnicityMatch[1] : '';
  
                    const descriptionMatch = match.match(descriptionPattern)
                    const description = descriptionMatch ? descriptionMatch[1] : '';
                     
  
                    return {name, age, msisdn, gender, county, town, level_of_education, profession, marital_status, religion, ethnicity, description };
                  };
                  
              
                
              
              // Global regex to match all occurrences in the string
              const globalRegex = /(?:Name|Aged|Gender|County|Town|MSISDN|Level of Education|Profession|Marital Status|Religion|Ethnicity|Description):\s*[A-Za-z\s\d,:]+/g;
              
              console.log(globalRegex.test(response)); // Expected output: true
              
              console.log(globalRegex.lastIndex); // Expected output: 0
              
              console.log(globalRegex.test(response)); // Expected output: true
              
              console.log(globalRegex.lastIndex); // Expected output: 9
              
              console.log(globalRegex.test(response)); // Expected output: false
              
                const newMatches = matchesData.filter(match => match !== '').map(match => {
                  return extractMatchInfo(match);
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
        params: { msisdn, page: currentPage }
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
            <MatchesTable data={matches} />
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

      case 2:
        return (
          <div className="section">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name:</label><br />
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} /><br />

              <label htmlFor="age">Age:</label><br />
              <input type="text" id="age" name="age" value={formData.age} onChange={handleChange} /><br />

              <label htmlFor="gender">Gender:</label><br />
              <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} /><br />

              <label htmlFor="county">County:</label><br />
              <input type="text" id="county" name="county" value={formData.county} onChange={handleChange} /><br />

              <label htmlFor="town">Town:</label><br />
              <input type="text" id="town" name="town" value={formData.town} onChange={handleChange} /><br />

              <button type="submit">Next</button>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="section">
            <h2>Update your Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="level_of_education">Level of Education:</label><br />
              <input type="text" id="level_of_education" name="level_of_education" value={formData.level_of_education} onChange={handleChange} /><br />

              <label htmlFor="profession">Profession:</label><br />
              <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} /><br />

              <label htmlFor="marital_status">Marital Status:</label><br />
              <input type="text" id="marital_status" name="marital_status" value={formData.marital_status} onChange={handleChange} /><br />

              <label htmlFor="religion">Religion:</label><br />
              <input type="text" id="religion" name="religion" value={formData.religion} onChange={handleChange} /><br />

              <label htmlFor="ethnicity">Ethnicity:</label><br />
              <input type="text" id="ethnicity" name="ethnicity" value={formData.ethnicity} onChange={handleChange} /><br />


              <button type="submit">Next</button>
            </form>
          </div>
        );

      case 4:
        return (
          <div className='section'>
            <h2>Describe Yourself</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor='description'>Description:</label><br />
              <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} /><br />
              <button type="submit">Next</button>
            </form>
          </div>
        )

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
