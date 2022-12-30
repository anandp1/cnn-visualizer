from flask import Flask
from flask import request
from predict import predict_digit

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    print("here");
    data = request.get_json(force=True)
    test = predict_digit(data)

    print(test)
    return {"prediction" : int(test)}

if __name__ == "__main__":
    app.run(debug=True)