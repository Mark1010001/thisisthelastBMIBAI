"""
models/classifier.py
═════════════════════
Pure calculation and classification functions:
  • BMI calculation and standard/ethnic classification
  • BAI calculation and gender-specific classification
  • Age band derivation for risk lookup
"""

from config.constants import (
    STANDARD_THRESHOLDS,
    ASIAN_THRESHOLDS,
    ADJUSTED_ETHNICITIES,
    BAI_CATEGORIES,
)


# ─────────────────────────────────────────────
# AGE BAND
# ─────────────────────────────────────────────

def get_age_band(age: int) -> str:
    """Map age to clinical risk band: Young / Middle / Senior."""
    if age < 40:
        return "Young"
    elif age < 60:
        return "Middle"
    else:
        return "Senior"


# ─────────────────────────────────────────────
# BMI
# ─────────────────────────────────────────────

def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Standard BMI formula: weight (kg) / height (m)²."""
    return round(weight_kg / (height_m ** 2), 1)


def classify_with_thresholds(bmi: float, thresholds: dict) -> str:
    """Classify BMI value against an arbitrary threshold dict."""
    for category, (low, high) in thresholds.items():
        if low <= bmi < high:
            return category
    return "Obese"


def classify_bmi(bmi: float) -> str:
    """Classify using the Global WHO standard thresholds."""
    return classify_with_thresholds(bmi, STANDARD_THRESHOLDS)


def classify_bmi_ethnic(bmi: float, ethnicity: str) -> str:
    """
    Classify using ethnicity-adjusted thresholds.
    Asian and Black populations use the tighter Asian Clinical thresholds.
    """
    thresholds = (
        ASIAN_THRESHOLDS if ethnicity in ADJUSTED_ETHNICITIES
        else STANDARD_THRESHOLDS
    )
    return classify_with_thresholds(bmi, thresholds)


# ─────────────────────────────────────────────
# BAI  (Body Adiposity Index)
# Formula: (Hip circumference cm / Height m^1.5) - 18
# Source:  Bergman et al. (2011), Obesity Journal
# ─────────────────────────────────────────────

def calculate_bai(hip_cm: float, height_m: float) -> float:
    """
    Body Adiposity Index — estimates body fat % directly.
    Requires hip circumference in cm and height in metres.
    """
    return round((hip_cm / (height_m ** 1.5)) - 18, 1)


def classify_bai(bai: float, gender: str, age: int) -> str:
    """
    Classify BAI using gender and age-specific ranges (Bergman et al., 2011).
    Gender must be 'Male' or 'Female'.
    """
    gender_ranges = BAI_CATEGORIES.get(gender, BAI_CATEGORIES["Male"])
    age_band = get_age_band(age)
    ranges = gender_ranges.get(age_band, gender_ranges["Young"])

    for category, (low, high) in ranges.items():
        if low <= bai < high:
            return category
    return "Obese"
