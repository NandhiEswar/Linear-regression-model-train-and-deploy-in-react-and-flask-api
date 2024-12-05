import numpy as np
import joblib
import traceback
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load("trained_model.pkl")
    print(f"Model loaded successfully: {type(model)}")
except FileNotFoundError:
    print("Error: Model file 'trained_model.pkl' not found!")
    exit(1)
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# In-memory storage for user predictions
predictions = {}


@app.route("/predict/<id>", methods=["POST"])
def predict(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        print(f"Input data: {data}")  # Debug print to inspect the input

        # Extract and validate features
        required_fields = [
            "age",
            "bmi",
            "children",
            "sex_male",
            "sex_female",
            "smoker_yes",
            "smoker_no",
            "region_northwest",
            "region_southeast",
            "region_southwest",
            "region_northeast",
        ]

        features = []
        for field in required_fields:
            value = data.get(field)
            if value is None or not isinstance(value, (int, float)):
                return (
                    jsonify({"message": f"Invalid or missing value for '{field}'"}),
                    400,
                )
            features.append(value)

        # Apply np.log1p transformation to 'children' if needed
        features[2] = np.log1p(features[2])

        # Convert features to a 2D array (required for .predict)
        features = [features]  # Make it a list of lists (2D array)
        print(f"Features array: {features}")  # Debug print for features

        # Perform prediction using the model's predict method
        predictions_result = model.predict(features)
        print(
            f"Prediction: {np.expm1(predictions_result)}"
        )  # Debug print for prediction

        # Store and return prediction
        predictions[id] = predictions_result[
            0
        ]  # Store only the first prediction if it's a list
        return (
            jsonify(
                {
                    "message": f"Prediction for ID {id} saved successfully!",
                    "prediction": np.expm1(predictions_result[0]),
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error occurred: {traceback.format_exc()}")  # Debug print for traceback
        return (
            jsonify(
                {
                    "message": "Error occurred during prediction",
                    "error": traceback.format_exc(),
                }
            ),
            500,
        )


# Endpoint to retrieve predictions
@app.route("/return_value/<id>", methods=["GET"])
def send_prediction(id):
    """
    API endpoint to retrieve a stored prediction for a given user ID.
    """
    try:
        if id in predictions:
            return (
                jsonify(
                    {
                        "message": f"Prediction for ID {id} retrieved successfully!",
                        "prediction": np.expm1(predictions[id]),
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": f"No prediction found for ID {id}"}), 404
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "Error occurred while retrieving prediction",
                    "error": traceback.format_exc(),
                }
            ),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
