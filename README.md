## Linear Regression Model with Flask and React

# Introduction

This project is a complete end-to-end implementation of a Linear Regression Model integrated with a Flask API backend and a React frontend. The system takes user inputs via the React frontend, processes them through a Flask API where the machine learning model is deployed, and returns the prediction results to the user.

Key Features:
Linear Regression Model: The model predicts outcomes based on input data.
Log Transformation: Data preprocessing with log transformations to handle skewed distributions.
Flask API: A Python-based web API that serves the model and handles incoming requests.
React Frontend: A user-friendly interface that communicates with the Flask API to display predictions.
Local Storage: The user’s prediction data is temporarily stored in the browser’s local storage with unique IDs.
R-Squared (R²): The performance of the model was evaluated, yielding an R² score of 73%, which indicates the model’s effectiveness in explaining the variance in the data.
Project Structure

/Linear-regression-model
│
├── /Flask
│   ├── app.py                   # Main Flask API file
│   └── model.pkl                # Pickled linear regression model
│
├── /react
│   ├── /public
│   ├── /src
│   │   ├── App.js               # Main React component
│   │   ├── api.js               # Axios requests to Flask API
│   │   └── storage.js           # LocalStorage management for user data
│   └── package.json             # React dependencies
│
├── README.md                    # Project documentation
└── requirements.txt             # Python dependencies
Flask API: app.py

The backend of this application is built using Flask, a lightweight web framework for Python. The API serves the machine learning model and exposes an endpoint that the React frontend can call to get predictions.

Setting up Flask API:
Install Dependencies: Install the necessary Python libraries using the following command:
pip install -r requirements.txt
Model Training and Deployment:
The Linear Regression model is trained on historical data and saved as a .pkl file using Pickle.
Log transformations are applied to the input features that are skewed to improve model performance.
When deploying, the data undergoes the inverse transformation (exponentiation) to ensure the predictions are in the original scale.
Code Example (app.py):
from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model
with open('model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_features = np.array(data['features']).reshape(1, -1)
        
        # Apply log transformation on skewed features
        transformed_features = np.log1p(input_features)
        
        # Get the prediction from the model
        prediction = model.predict(transformed_features)
        
        # Exponentiate to get predictions in the original scale
        final_prediction = np.expm1(prediction)
        
        return jsonify({'prediction': final_prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
React Frontend

The frontend is built using React and communicates with the Flask API to send user inputs and display the model's predictions.

Features:
Local Storage: User data, including the generated unique ID, is stored in the browser’s local storage.
No Database: Instead of storing data in a database, all user data is temporarily stored in the local cache, which is cleared once the user fetches the ID.
Key Concepts:
Unique ID: Each user session is assigned a unique ID, and this ID is used to retrieve user data.
One-Hot Encoding: Categorical features are encoded using one-hot encoding before being sent to the Flask API.
Code Example (App.js):
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [features, setFeatures] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [userId, setUserId] = useState(null);

  // Generate a unique ID for each session
  useEffect(() => {
    const id = localStorage.getItem('userId') || Math.random().toString(36).substr(2, 9);
    setUserId(id);
    localStorage.setItem('userId', id);
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        features: features,
      });
      setPrediction(response.data.prediction);
      localStorage.removeItem('userId'); // Remove from local storage after fetching data
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div>
      <h1>Linear Regression Prediction</h1>
      <input
        type="number"
        placeholder="Enter feature values"
        onChange={(e) => setFeatures([parseFloat(e.target.value)])}
      />
      <button onClick={handleSubmit}>Predict</button>
      {prediction && <h2>Prediction: {prediction}</h2>}
    </div>
  );
}

export default App;
Data Preprocessing and Model Evaluation

Data Preprocessing:
Log Transformation: To handle skewed data, I applied a log1p transformation (log(x+1)) to the skewed columns before training the linear regression model.
One-Hot Encoding: Categorical features were converted to numerical features using one-hot encoding, ensuring the model could process them properly.
Model Evaluation:
The performance of the linear regression model was evaluated using the R-squared (R²) metric. The model achieved an R² score of 73%, which indicates that the model explains 73% of the variance in the data, showing reasonable predictive power.

Linear Regression Model Evaluation Code:
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import numpy as np

# Load and preprocess data
data = ...  # Load your dataset
X = data.drop('target', axis=1)
y = data['target']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply log transformation to skewed features
X_train_log = np.log1p(X_train)
X_test_log = np.log1p(X_test)

# Train the model
model = LinearRegression()
model.fit(X_train_log, y_train)

# Make predictions and evaluate the model
y_pred = model.predict(X_test_log)
r2 = r2_score(y_test, y_pred)

print(f"R-squared score: {r2 * 100:.2f}%")
Conclusion

This project demonstrates how to deploy a machine learning model using Flask as an API and React as the frontend. It involves important concepts like data preprocessing (log transformation and one-hot encoding) and model evaluation (R² score). Additionally, the use of local storage allows for an efficient way of managing user sessions without the need for a backend database.

