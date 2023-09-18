import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier


def balanced_dataset(df):
    data_balanced = df.groupby("label").sample(
        n=df["label"].value_counts().min(), random_state=42
    )

    balanced_count = data_balanced.groupby(by="label").count()
    print(balanced_count.head(10))
    return data_balanced


def train(df):
    df = balanced_dataset(df)
    x = df.iloc[:, 1:7]
    y = df.iloc[:, 7]
    clf = ExtraTreesClassifier(max_depth=25, random_state=0)
    print("Initiated training process")
    fitted_clf = clf.fit(x, y)
    print("finilized training process")
    return fitted_clf
