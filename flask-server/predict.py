from keras.models import load_model
import numpy as np
from keras.models import Model
import tensorflow as tf

firstCovLayer = 'conv0'  # (None, 26, 26, 32)
secondCovLayer = 'conv1'  # (None, 24, 24, 32)
thirdCovLayer = 'conv2'  # (None, 10, 10, 64)
fourthCovLayer = 'conv3'  # (None, 8, 8, 64)
flattenLayer = 'flatten_1'  # (None, 1024)
fullyConnectedLayer = 'fc1'  # (None, 254)
outputLayer = 'fco'  # (None, 10)


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

    modelLayers = {"firstCovLayer": firstCovLayer, "secondCovLayer": secondCovLayer, "thirdCovLayer": thirdCovLayer,
                   "fourthCovLayer": fourthCovLayer, "flattenLayer": flattenLayer, "fullyConnectedLayer": fullyConnectedLayer, "outputLayer": outputLayer}

    modelLayerOutputs = {}
    for layer in modelLayers:
        modelLayerOutput = getLayerOutput(
            modelLayers[layer], model, img)
        modelLayerOutputs[layer] = np.vstack(modelLayerOutput.T).tolist()

    predictArr = model.predict(img)
    prediction = np.argmax(predictArr)

    return {'prediction': int(prediction), 'modelLayerOutputs': modelLayerOutputs}


def getLayerOutput(layerName, model, img):
    intermediateLayerModel = Model(inputs=model.input,
                                   outputs=model.get_layer(layerName).output)
    intermediateLayerOutput = intermediateLayerModel.predict(img)

    return intermediateLayerOutput
