from flask import Flask
from flask import request

from predict import predict_digit

app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    predictedDigitData = predict_digit(data)

    return {"prediction": predictedDigitData["prediction"], 'modelLayerOutputs': predictedDigitData["modelLayerOutputs"]}


if __name__ == "__main__":
    app.run(debug=True)
