import React, { useState, useEffect } from 'react';
import "./App.css";
const App = () => {
  const [tables, setTables] = useState([]);
  const [email, setEmail] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [error, setError] = useState('');
  const [action, setAction] = useState('fetch'); // State to track current action: 'fetch', 'add', 'delete'
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch all tables from the database
  useEffect(() => {
    fetch('http://localhost:5000/api/tables')
      .then(response => response.json())
      .then(data => setTables(data))
      .catch(err => setError('Error fetching tables'));
  }, []);

  // Handle search for user by name
  const searchUserByName = () => {
    fetch(`http://localhost:5000/api/user/${nameSearch}`)
      .then(response => response.json())
      .then(data => {
        if (data.email) {
          setEmail(data.email);
        } else {
          setEmail('');
          setError('User not found');
        }
      })
      .catch(err => setError('Error fetching user data'));
  };

  // Handle adding a new user
  const addUser = () => {
    if (!newUserName || !newUserEmail) {
      setError('Name and Email are required');
      return;
    }
    fetch('http://localhost:5000/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUserName, email: newUserEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setError('');
          setNewUserName('');
          setNewUserEmail('');
          alert(data.message);
        } else {
          setError('Error adding user');
        }
      })
      .catch(err => setError('Error adding user'));
  };

  // Handle deleting a user by name
  const deleteUser = () => {
    fetch(`http://localhost:5000/api/user/${nameSearch}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setEmail('');
          setError('');
          alert(data.message);
        } else {
          setError('Error deleting user');
        }
      })
      .catch(err => setError('Error deleting user'));
  };

  // Switch between different actions (fetch, add, delete)
  const handleActionChange = (actionType) => {
    setAction(actionType);
    setError('');
    setEmail('');
    setNewUserName('');
    setNewUserEmail('');
    setNameSearch('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CRUD App</h1>

      {/* Action Buttons to Switch Between Fetching, Adding, and Deleting */}
      <div>
        <button onClick={() => handleActionChange('fetch')}>Fetch User</button>
        <button onClick={() => handleActionChange('add')}>Add User</button>
        <button onClick={() => handleActionChange('delete')}>Delete User</button>
      </div>

      {/* Display tables */}
      <h2>Database Tables</h2>
      {tables.length > 0 ? (
        <ul>
          {tables.map((table, index) => (
            <li key={index}>{table}</li>
          ))}
        </ul>
      ) : (
        <p>No tables found</p>
      )}

      {/* Action Forms */}
      {action === 'fetch' && (
        <div>
          <h2>Search User by Name</h2>
          <input
            type="text"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Enter name"
          />
          <button onClick={searchUserByName}>Search</button>

          {email && (
            <div>
              <h3>Email:</h3>
              <p>{email}</p>
            </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {action === 'add' && (
        <div>
          <h2>Add New User</h2>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter name"
          />
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Enter email"
          />
          <button onClick={addUser}>Add User</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {action === 'delete' && (
        <div>
          <h2>Delete User by Name</h2>
          <input
            type="text"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Enter name"
          />
          <button onClick={deleteUser}>Delete User</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
