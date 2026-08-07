import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "pincode_data.csv"

try:
    pincode_df = pd.read_csv(DATA_PATH)
except Exception:
    pincode_df = pd.DataFrame()


def verify_pincode(pincode):
    if pincode_df.empty:
        return None

    result = pincode_df[pincode_df["pincode"].astype(str) == str(pincode)]

    if result.empty:
        return None

    row = result.iloc[0]

    return {
        "pincode": row["pincode"],
        "office": row["officename"],
        "district": row["district"],
        "state": row["statename"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
    }