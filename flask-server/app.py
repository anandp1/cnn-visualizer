from flask import Flask
from flask import request
from predict import predict_digit

app = Flask(__name__)

# Members API Route
@app.route("/predict", methods=["POST"])
def predict():
    print("here");
    data = request.get_json(force=True)
    return predict_digit(data)

if __name__ == "__main__":
    app.run(debug=True)