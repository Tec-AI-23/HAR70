from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO

import joblib

from typing import Annotated, Dict
from sklearn.ensemble import ExtraTreesClassifier
import pandas as pd

import model

app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
har70.csv is the concatenation of all 15 dataframes provided kaggle at:
https://www.kaggle.com/datasets/suzy83/the-human-activity-recognition-70-har70-dataset

It is too big to push to GitHub using the default tools.
Although it is needed at first, the API is created to take new csv's, so it is possible
to simply initiate an empty dataframe in case of missing the har70.csv:
"""
df = pd.read_csv("har70.csv")
#df = pd.Dataframe()

clf = ExtraTreesClassifier()

cols = ["back_x", "back_y", "back_z", "thigh_x", "thigh_y", "thigh_z"]

activity_labels = {
    1: "Walking",
    3: "Shuffling",
    4: "Stairs (ascending)",
    5: "Stairs (descending)",
    6: "Standing",
    7: "Sitting",
    8: "Lying",
}


@app.get("/")
async def root():
    return {"message": "Welcome to our API for AI models"}


def process_csv(csv_file):
    df = pd.read_csv(BytesIO(csv_file))
    print(df.head())
    print(df.columns)
    return df


@app.post("/dataset/")
async def upload_csv(file: UploadFile):
    global df
    if file.filename.endswith(".csv"):
        contents = await file.read()
        try:
            df = process_csv(contents)
        except:
            raise HTTPException(
                status_code=400,
                detail="Error while converting csv to pandas dataframe.",
            )
        return {"message": "CSV file uploaded and processed successfully"}
    else:
        raise HTTPException(
            status_code=400,
            detail="Wrong file format.",
        )


@app.get("/fit/")
async def fit_model():
    global clf, df
    try:
        clf = model.train(df)
        joblib.dump(clf, "fitted_extra_trees_model.pkl")
        return {"message": str(clf)}
    except HTTPException as e:
        raise e


@app.post("/predict/")
async def predict_activity(sensor_data: Dict[str, float] = Body(...)):
    global clf
    clf = joblib.load("fitted_extra_trees_model.pkl")

    df_to_predict = pd.DataFrame(columns=cols)
    df_to_predict = pd.concat(
        [df_to_predict, pd.DataFrame(sensor_data, index=[0])], ignore_index=True
    )
    predicted_label = clf.predict(df_to_predict)
    return {
        "message": "Prediction successfull!",
        "activity": activity_labels[predicted_label[0]],
    }


@app.get("/model_availability/")
async def get_model_availability():
    clf = joblib.load("fitted_extra_trees_model.pkl")
    if clf:
        return {"message": "There is a model available!"}
    else:
        return {"message": "Please fit a model."}
