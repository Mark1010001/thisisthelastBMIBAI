"""
data/generator.py
══════════════════
KDD Pipeline — Steps 1, 2, 3, 4:

  Step 1 — Data Collection  : Synthetic dataset of 1000 users
  Step 2 — Data Cleaning    : Clip measurements to valid physiological ranges
  Step 3 — Transformation   : Derive BMI, BAI, age groups, risk labels
  Step 4 — Data Mining      : Descriptive stats, risk disparity, BMI-BAI agreement
"""

import numpy as np
import pandas as pd

from config.constants import RACE_OPTIONS, BAI_CATEGORIES
from models.classifier import (
    calculate_bmi,
    calculate_bai,
    classify_bmi,
    classify_bai,
    classify_bmi_ethnic,
)

np.random.seed(42)


# ─────────────────────────────────────────────
# STEP 1 & 2 — COLLECTION & CLEANING
# ─────────────────────────────────────────────

def generate_dataset(n: int = 1000) -> pd.DataFrame:
    """
    Generate a synthetic health dataset with realistic physiological ranges.
    Includes: Age, Gender, Race, Height, Weight, Hip circumference.
    All values are clipped to valid physiological bounds (Step 2 cleaning).
    """
    ages      = np.random.randint(18, 71, size=n)
    genders   = np.random.choice(["Male", "Female"], size=n)
    races = np.random.choice(RACE_OPTIONS, size=n, p=[0.40, 0.60])

    bmi_means = 20 + (ages - 18) * 0.18 + np.random.normal(0, 3, n)
    bmi_means = np.clip(bmi_means, 14, 42)

    heights_m  = np.random.normal(1.70, 0.10, n)
    heights_m  = np.clip(heights_m, 1.45, 2.10)
    weights_kg = bmi_means * (heights_m ** 2)
    weights_kg = np.clip(weights_kg, 35, 160)

    # Gender-differentiated hip circumference (realistic ranges)
    hip_cm = np.where(
        genders == "Female",
        np.random.normal(100, 12, n),   # Women: avg ~100 cm
        np.random.normal(95,  10, n),   # Men:   avg ~95 cm
    )
    hip_cm = np.clip(hip_cm, 70, 145)

    return pd.DataFrame({
        "Age":       ages,
        "Gender":    genders,
        "Race":      races,
        "Height_m":  heights_m.round(2),
        "Weight_kg": weights_kg.round(1),
        "Hip_cm":    hip_cm.round(1),
    })


# ─────────────────────────────────────────────
# STEP 3 — TRANSFORMATION
# ─────────────────────────────────────────────

def transform_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Derive all computed columns from raw measurements:
      BMI, BAI, risk categories (standard + ethnic + BAI), age group bands.
    """
    df = df.copy()

    df["BMI"] = df.apply(
        lambda r: calculate_bmi(r["Weight_kg"], r["Height_m"]), axis=1
    )
    df["BAI"] = df.apply(
        lambda r: calculate_bai(r["Hip_cm"], r["Height_m"]), axis=1
    )
    df["Risk_Category"] = df["BMI"].apply(classify_bmi)
    df["BAI_Category"]  = df.apply(
        lambda r: classify_bai(r["BAI"], r["Gender"], r["Age"]), axis=1
    )
    df["Ethnic_Category"] = df.apply(
        lambda r: classify_bmi_ethnic(r["BMI"], r["Race"]), axis=1
    )
    df["Age_Group"] = pd.cut(
        df["Age"],
        bins=[17, 30, 45, 60, 71],
        labels=["18-30", "31-45", "46-60", "61-70"],
    )

    return df


# ─────────────────────────────────────────────
# STEP 4 — DATA MINING
# ─────────────────────────────────────────────

def mine_patterns(df: pd.DataFrame) -> dict:
    """
    Extract descriptive statistics and population-level patterns:
      • Average BMI/BAI by age group
      • Category distribution counts
      • Risk disparity (WHO Normal → High-Risk under ethnic thresholds)
      • BMI vs BAI agreement rate
    """
    avg_bmi_by_age  = df.groupby("Age_Group", observed=True)["BMI"].mean().round(1)
    category_counts = df["Risk_Category"].value_counts()
    overall_avg_bmi = round(df["BMI"].mean(), 1)
    overall_avg_bai = round(df["BAI"].mean(), 1)
    bmi_std         = round(df["BMI"].std(), 1)

    # Risk disparity: classified Normal by WHO but High Risk under ethnic threshold
    disparity_mask = (
        (df["Risk_Category"] == "Normal") &
        (df["Ethnic_Category"].isin(["Overweight", "Obese"]))
    )
    disparity_df = df[disparity_mask].copy()

    disparity_by_race = (
        disparity_df.groupby("Race")
        .size()
        .reindex(RACE_OPTIONS, fill_value=0)
        .reset_index()
    )
    disparity_by_race.columns = ["Race", "Reclassified_Count"]

    # BMI vs BAI agreement rate
    agreement_count = int((df["Risk_Category"] == df["BAI_Category"]).sum())

    return {
        "avg_bmi_by_age":    avg_bmi_by_age,
        "category_counts":   category_counts,
        "most_common_cat":   category_counts.idxmax(),
        "overall_avg_bmi":   overall_avg_bmi,
        "overall_avg_bai":   overall_avg_bai,
        "bmi_std":           bmi_std,
        "total_users":       len(df),
        "disparity_count":   int(disparity_mask.sum()),
        "disparity_df":      disparity_df,
        "disparity_by_race": disparity_by_race,
        "agreement_count":   agreement_count,
    }
