"""
config/constants.py
═══════════════════
All threshold tables, color maps, race options, risk probability table,
and BAI category ranges used throughout the BMI Health Risk Classifier.
"""

# ─────────────────────────────────────────────
# BMI CLASSIFICATION THRESHOLDS
# ─────────────────────────────────────────────

STANDARD_THRESHOLDS = {
    "Underweight": (0,    18.5),
    "Normal":      (18.5, 24.9),
    "Overweight":  (25.0, 29.9),
    "Obese":       (30.0, float("inf")),
}

ASIAN_THRESHOLDS = {
    "Underweight": (0,    18.5),
    "Normal":      (18.5, 22.9),
    "Overweight":  (23.0, 24.9),
    "Obese":       (25.0, float("inf")),
}

ADJUSTED_ETHNICITIES = {"Southeast Asian (Filipino)"}

# ─────────────────────────────────────────────
# DISPLAY / UI CONFIG
# ─────────────────────────────────────────────

CATEGORY_COLORS = {
    "Underweight": "#378ADD",
    "Normal":      "#d4f01e",
    "Overweight":  "#BA7517",
    "Obese":       "#E24B4A",
}

RACE_OPTIONS = ["White", "Southeast Asian (Filipino)"]

STANDARD_GLOBAL = "Global WHO Standard"
STANDARD_ASIAN  = "Asian Clinical Standard"

# ─────────────────────────────────────────────
# BAI NORMAL RANGES BY GENDER & AGE (body fat %)
# Source: Bergman et al. (2011), Obesity Journal
# ─────────────────────────────────────────────

BAI_CATEGORIES = {
    "Male": {
        "Young": {
            "Underweight": (0,    8.0),
            "Normal":      (8.0,  21.0),
            "Overweight":  (21.0, 26.0),
            "Obese":       (26.0, float("inf")),
        },
        "Middle": {
            "Underweight": (0,    11.0),
            "Normal":      (11.0, 23.0),
            "Overweight":  (23.0, 29.0),
            "Obese":       (29.0, float("inf")),
        },
        "Senior": {
            "Underweight": (0,    13.0),
            "Normal":      (13.0, 25.0),
            "Overweight":  (25.0, 31.0),
            "Obese":       (31.0, float("inf")),
        }
    },
    "Female": {
        "Young": {
            "Underweight": (0,    21.0),
            "Normal":      (21.0, 33.0),
            "Overweight":  (33.0, 39.0),
            "Obese":       (39.0, float("inf")),
        },
        "Middle": {
            "Underweight": (0,    23.0),
            "Normal":      (23.0, 35.0),
            "Overweight":  (35.0, 41.0),
            "Obese":       (41.0, float("inf")),
        },
        "Senior": {
            "Underweight": (0,    25.0),
            "Normal":      (25.0, 38.0),
            "Overweight":  (38.0, 44.0),
            "Obese":       (44.0, float("inf")),
        }
    },
}

# ─────────────────────────────────────────────
# RISK PROBABILITY TABLE  (2026 Clinical Data)
# Keys: (age_band, bmi_category) → risk metadata
# ─────────────────────────────────────────────

RISK_PROBABILITY = {
    ("Young",  "Underweight"): {"prob": 0.22, "level": "Moderate", "color": "#BA7517"},
    ("Young",  "Normal"):      {"prob": 0.05, "level": "Low",      "color": "#639922"},
    ("Young",  "Overweight"):  {"prob": 0.18, "level": "Low-Mod",  "color": "#BA7517"},
    ("Young",  "Obese"):       {"prob": 0.35, "level": "Moderate", "color": "#E24B4A"},
    ("Middle", "Underweight"): {"prob": 0.30, "level": "Moderate", "color": "#BA7517"},
    ("Middle", "Normal"):      {"prob": 0.10, "level": "Low",      "color": "#639922"},
    ("Middle", "Overweight"):  {"prob": 0.40, "level": "Moderate", "color": "#BA7517"},
    ("Middle", "Obese"):       {"prob": 0.60, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Underweight"): {"prob": 0.50, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Normal"):      {"prob": 0.15, "level": "Low",      "color": "#639922"},
    ("Senior", "Overweight"):  {"prob": 0.55, "level": "High",     "color": "#E24B4A"},
    ("Senior", "Obese"):       {"prob": 0.80, "level": "CRITICAL", "color": "#FF0000"},
}

# ─────────────────────────────────────────────
# PLOTLY DARK THEME BASE
# ─────────────────────────────────────────────

PLOTLY_DARK = dict(
    paper_bgcolor="#0e1117",
    plot_bgcolor="#0e1117",
    font=dict(color="#ccc"),
    xaxis=dict(gridcolor="#222", zerolinecolor="#333"),
    yaxis=dict(gridcolor="#222", zerolinecolor="#333"),
)
