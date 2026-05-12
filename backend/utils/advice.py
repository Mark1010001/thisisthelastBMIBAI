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

def get_dynamic_coach_advice(gender: str, age: int, bmi: float, bai: float, bmi_cat: str, bai_cat: str, standard: str) -> str:
    """
    Generates a genuinely dynamic AI-styled coaching message that responds to 
    specific user metrics and classification standards.
    """
    
    # Simulate an AI persona with dynamic responses
    intro = f"Hey! I've analyzed your data as a {age}-year-old {gender.lower()}."
    
    # Specific BMI/Standard context
    if "Asian" in standard:
        std_context = "Using the Asian Clinical Standard (which is more sensitive to body fat in SEA populations),"
    else:
        std_context = "Based on the Global WHO Standard,"
        
    bmi_val = round(bmi, 1)
    bai_val = round(bai, 1)
    
    core_analysis = f"{std_context} your BMI of {bmi_val} places you in the '{bmi_cat}' category."
    
    # Cross-referencing BMI and BAI
    if bmi_cat == bai_cat:
        if bmi_cat == "Normal":
            cross_ref = f"Great news! Your BAI of {bai_val}% aligns with your BMI, confirming you're in a very healthy range for your age."
        else:
            cross_ref = f"Notably, your BAI ({bai_val}%) also indicates you're '{bai_cat}', confirming that this isn't just about weight, but body composition too."
    else:
        cross_ref = f"Interestingly, while your BMI says '{bmi_cat}', your BAI of {bai_val}% suggests a '{bai_cat}' body fat level. This often happens when muscle mass or bone density shifts the balance."

    # Personalized tips based on category
    tips = {
        "Underweight": "Since we're looking to build up, let's focus on nutrient-dense surplus. Think avocados, nuts, and progressive resistance training.",
        "Normal": "You're in the 'Goldilocks' zone! Let's keep that metabolic flexibility high with a mix of HIIT and steady-state movement.",
        "Overweight": f"We're just a bit over the threshold. Focusing on a 10% reduction in refined sugars could see that {bmi_val} BMI drop into the normal range quite quickly.",
        "Obese": f"The priority here is sustainable change. Given your age of {age}, we should focus on low-impact joint-friendly movement like swimming or brisk walking to protect your knees while we work on the {bmi_val} BMI."
    }
    
    advice = tips.get(bmi_cat, "Keep monitoring your metrics and stay active!")
    
    # Dynamic closing
    closing = f"Let's check back in if your weight or activity levels change. You've got this!"
    
    # Assemble the "AI" message
    full_message = f"{intro} {core_analysis} {cross_ref} {advice} {closing}"
    
    return full_message
