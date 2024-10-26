from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import os

app = Flask(__name__)

CORS(app)  # Allow CORS for all routes

# Determine the base directory and construct the file path
base_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_dir, 'complete_crime_data.csv')

# Load and preprocess your dataset
data = pd.read_csv(file_path)

# Define your danger level classification
def danger_level(row):
    total_crimes = row[['Rape', 'Custodial Rape', 'Custodial_Gang Rape',
                         'Custodial_Other Rape', 'Rape other than Custodial',
                         'Rape_Gang Rape', 'Rape_Others', 'Attempt to commit Rape',
                         'Acid attack', 'Attempt to Acid Attack', 'Dowry Deaths',
                         'Assault on Women with intent to outrage her Modesty',
                         'Sexual Harassment', 'Other Assault on Women',
                         'Cruelty by Husband or his Relatives', 'Importation of Girls from Foreign Country']].sum()
    if total_crimes > 900:
        return 'Red'
    elif total_crimes > 550:
        return 'Yellow'
    else:
        return 'Green'

data['Danger_Level'] = data.apply(danger_level, axis=1)
data['Danger_Level'] = data['Danger_Level'].map({'Green': 0, 'Yellow': 1, 'Red': 2})

# Prepare features and target variable
X = data[['Latitude', 'Longitude']]
y = data['Danger_Level']

# Split and scale the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train_scaled, y_train)

# Define the prediction function
def predict_danger_level(latitude, longitude):
    new_data = np.array([[latitude, longitude]])
    new_data_scaled = scaler.transform(new_data)
    prediction = model.predict(new_data_scaled)
    danger_map = {0: 'Green', 1: 'Yellow', 2: 'Red'}
    return danger_map[prediction[0]]

# Define the API endpoint
@app.route('/api/user/predict', methods=['POST'])  # Corrected route
def predict():
    data = request.get_json()
    latitude = data['latitude']
    longitude = data['longitude']
    danger_level = predict_danger_level(latitude, longitude)
    return jsonify({'danger_level': danger_level})

if __name__ == '__main__':
    app.run(port=5000, debug=True)  # Ensure it's running on port 5000
