from keras.models import load_model
import numpy as np

def predict_digit(data):
    # print(data["matrix"]);
    inputMatrix = data["matrix"]

    model = load_model('/digit_classifier.h5')
    test_image = inputMatrix.reshape(-1,28,28,1)
    test = np.argmax(model.predict(test_image))

    
    print(test);
    return ["hi"]