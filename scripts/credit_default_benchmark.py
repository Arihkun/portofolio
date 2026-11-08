"""Reproduce an independent public-data credit-default benchmark.

Run: python scripts/credit_default_benchmark.py
The source dataset is downloaded into memory; no customer data or fitted model
is written to this portfolio. The printed metrics are copied into the case study.
"""

from io import BytesIO
from zipfile import ZipFile

import numpy as np
import pandas as pd
import requests
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


DATA_URL = "https://archive.ics.uci.edu/static/public/350/default+of+credit+card+clients.zip"
SEED = 42
FEATURES = [
    "LIMIT_BAL",
    "PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6",
    *[f"BILL_AMT{i}" for i in range(1, 7)],
    *[f"PAY_AMT{i}" for i in range(1, 7)],
]


def load_dataset():
    response = requests.get(DATA_URL, timeout=60)
    response.raise_for_status()
    with ZipFile(BytesIO(response.content)) as archive:
        workbook = next(name for name in archive.namelist() if name.lower().endswith(".xls"))
        frame = pd.read_excel(BytesIO(archive.read(workbook)), header=1)
    frame.columns = frame.columns.map(str)
    target = "Y" if "Y" in frame else "default payment next month"
    return frame[FEATURES].apply(pd.to_numeric), frame[target].astype(int)


def evaluate(name, model, x_train, x_test, y_train, y_test):
    model.fit(x_train, y_train)
    probability = model.predict_proba(x_test)[:, 1]
    # Stable ordering makes a tied baseline's top decile well-defined.
    top_count = len(probability) // 10
    selected = np.argsort(-probability, kind="stable")[:top_count]
    return {
        "model": name,
        "roc_auc": round(roc_auc_score(y_test, probability), 4),
        "pr_auc": round(average_precision_score(y_test, probability), 4),
        "brier": round(brier_score_loss(y_test, probability), 4),
        "top_decile_capture": round(float(y_test.to_numpy()[selected].sum() / y_test.sum()), 4),
        "top_decile_count": top_count,
    }


def main():
    x, y = load_dataset()
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=SEED, stratify=y
    )
    print(f"rows={len(x)} train={len(x_train)} holdout={len(x_test)} defaults={int(y_test.sum())}")
    models = [
        ("Prevalence baseline", DummyClassifier(strategy="prior")),
        ("Logistic regression", make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))),
        ("Histogram gradient boosting", HistGradientBoostingClassifier(max_iter=150, max_leaf_nodes=15, learning_rate=0.05, random_state=SEED)),
    ]
    for name, model in models:
        print(evaluate(name, model, x_train, x_test, y_train, y_test))


if __name__ == "__main__":
    main()
