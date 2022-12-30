from keras.models import load_model
import numpy as np
import tensorflow as tf


def infer_prec(img, img_size):
    img = tf.expand_dims(img, -1)          # from 28 x 28 to 28 x 28 x 1
    img = tf.divide(img, 255)              # normalize
    img = tf.image.resize(img,             # resize acc to the input
                          [img_size, img_size])
    img = tf.reshape(img,                  # reshape to add batch dimension
                     [1, img_size, img_size, 1])
    return img


def predict_digit(data):
    inputMatrix = data["matrix"]

    model = load_model('./digit_classifier.h5')
    npArr = np.array(inputMatrix)

    img = infer_prec(npArr, 28)

    predictArr = model.predict(img)
    test = np.argmax(predictArr)

    return test
