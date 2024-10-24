// src/App.js

import React, { useState } from 'react';

function App() {
    const [name, setName] = useState(''); // State to hold the input value
    const [greeting, setGreeting] = useState(''); // State to hold the greeting message

    const sendData = async () => {
        const response = await fetch('http://localhost:8000/api/response/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }), // Send the user's name
        });

        const data = await response.json();
        setGreeting(data.message); // Set the greeting message from the response
    };

    return (
        <div>
            <h1>React and Django Integration</h1>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} // Update state on input change
                placeholder="Enter your name" 
            />
            <button onClick={sendData}>Send Data</button>
            {greeting && <h2>{greeting}</h2>} {/* Display the greeting message */}
        </div>
    );
}

export default App;
