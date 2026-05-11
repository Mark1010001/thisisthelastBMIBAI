"""
utils/advice.py
═══════════════
Structured health advice per BMI category.
Each entry contains: emoji, summary, nutrition tips, activity tips, medical note.
"""

HEALTH_ADVICE = {
    "Underweight": {
        "emoji": "🔵",
        "summary": "Your BMI is below the healthy range. Focus on gaining weight safely.",
        "nutrition": [
            "Eat calorie-dense, nutrient-rich foods (nuts, avocados, whole grains).",
            "Add protein shakes or fortified smoothies between meals.",
            "Eat 5-6 smaller meals per day instead of 3 large ones.",
        ],
        "activity": [
            "Focus on strength training to build lean muscle mass.",
            "Avoid excessive cardio that burns too many calories.",
            "Prioritize rest and recovery for muscle growth.",
        ],
        "medical": "Consult a doctor to rule out underlying conditions (thyroid, malabsorption).",
    },
    "Normal": {
        "emoji": "🟢",
        "summary": "Your BMI is in the healthy range. Maintain your lifestyle!",
        "nutrition": [
            "Follow a balanced plate: half vegetables, quarter protein, quarter whole grains.",
            "Stay hydrated — aim for 8 glasses of water per day.",
            "Limit processed foods and added sugars.",
        ],
        "activity": [
            "Aim for 150 minutes of moderate aerobic activity per week.",
            "Include 2 days of strength training weekly.",
            "Stay active throughout the day — avoid prolonged sitting.",
        ],
        "medical": "Maintain annual check-ups; monitor blood pressure and cholesterol.",
    },
    "Overweight": {
        "emoji": "🟡",
        "summary": "Your BMI is slightly above normal. Small changes can make a big difference.",
        "nutrition": [
            "Reduce portion sizes; use smaller plates.",
            "Swap refined carbs for whole grains and leafy greens.",
            "Cut sugary beverages — replace with water or unsweetened tea.",
        ],
        "activity": [
            "Walk briskly for at least 30 minutes daily.",
            "Add swimming or cycling — low-impact but effective.",
            "Track your steps; aim for 8,000-10,000 steps per day.",
        ],
        "medical": "Monitor blood sugar and cholesterol levels every 6 months.",
    },
    "Obese": {
        "emoji": "🔴",
        "summary": "Your BMI indicates obesity. Please seek professional guidance.",
        "nutrition": [
            "Adopt a caloric deficit of 500-750 kcal/day under medical supervision.",
            "Prioritize high-fiber, high-protein foods to reduce hunger.",
            "Avoid ultra-processed foods, fast food, and sugary drinks entirely.",
        ],
        "activity": [
            "Start with low-impact activities: walking, water aerobics.",
            "Gradually increase duration before intensity.",
            "Consider working with a certified fitness trainer.",
        ],
        "medical": "See a doctor immediately to assess cardiovascular and metabolic risk.",
    },
}
