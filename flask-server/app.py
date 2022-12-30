from flask import Flask
from flask import request

from predict import predict_digit

app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    test = predict_digit(data)

    return {"prediction": int(test)}


if __name__ == "__main__":
    app.run(debug=True)
