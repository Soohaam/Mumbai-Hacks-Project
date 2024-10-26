import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [dangerLevel, setDangerLevel] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending data:', { latitude: parseFloat(latitude), longitude: parseFloat(longitude) });

            const response = await axios.post('http://localhost:5500/api/user/predict', {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)    
            });
            setDangerLevel(response.data.danger_level);
        } catch (error) {
            console.log(error)
            console.error('Error fetching danger level:', error);
        }
    };

    return (
        <div>
            <h1>Crime Danger Level Predictor</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                />
                <button type="submit">Predict</button>
            </form>
            {dangerLevel && <h2>Predicted Danger Level: {dangerLevel}</h2>}
        </div>
    );
}

export default App;
