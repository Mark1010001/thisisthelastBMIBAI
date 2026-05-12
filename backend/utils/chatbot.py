import random
import re

def get_chatbot_response(message, metrics, results):
    """
    Simulates an AI coach response based on user metrics and message content.
    """
    msg = message.lower()
    bmi = results.get('bmi', 0)
    bai = results.get('bai', 0)
    age = metrics.get('age', 0)
    gender = metrics.get('gender', 'Unknown')
    bmi_cat = results.get('bmi_category', 'Normal')
    bai_cat = results.get('bai_category', 'Normal')

    # Personalized context strings
    context = f"Analyzing your profile... You are a {age}-year-old {gender} with a BMI of {bmi} ({bmi_cat}) and a BAI of {bai}% ({bai_cat}). "

    # Greetings & General
    if any(word in msg for word in ['hi', 'hello', 'hey', 'who are you', 'help']):
        return (f"Hello! I'm your AI Health Coach. {context}"
                "I'm here to provide evidence-based insights into your body composition metrics. "
                f"Currently, your BMI falls into the {bmi_cat} range. Would you like to discuss how to optimize this, "
                "or should we look closer at your BAI results?")

    # BMI Questions
    if 'bmi' in msg:
        if any(word in msg for word in ['what', 'explain', 'mean']):
            return (f"BMI (Body Mass Index) is a screening tool that uses your height and weight to estimate body fatness. "
                    f"Your BMI is {bmi}, which is {bmi_cat}. {get_category_advice(bmi_cat)} "
                    "Keep in mind that BMI doesn't distinguish between muscle and fat, which is why we also look at your BAI.")
        return f"Your BMI of {bmi} puts you in the {bmi_cat} category. For a {age}-year-old {gender}, this is a key indicator of your metabolic health risk level."

    # BAI Questions
    if 'bai' in msg:
        if any(word in msg for word in ['what', 'explain', 'mean']):
            return (f"BAI (Body Adiposity Index) is an alternative way to estimate body fat percentage using your hip circumference and height. "
                    f"Your BAI is {bai}%, classified as {bai_cat}. Unlike BMI, it doesn't rely on weight, which can be useful if you have high muscle mass.")
        return f"Your BAI is {bai}%, which I classify as {bai_cat}. This metric helps us understand your body fat distribution independently of your total weight."

    # Improvement/Advice
    if any(word in msg for word in ['improve', 'reduce', 'lose', 'gain', 'better', 'advice', 'tips', 'how to']):
        if bmi_cat == 'Overweight' or bmi_cat == 'Obese':
            return (f"To transition from {bmi_cat} towards a healthier range, I recommend focusing on both nutritional density and metabolic activity. "
                    f"Since your BAI is {bai}%, reducing adiposity while maintaining lean mass is priority. "
                    "Try incorporating 150 minutes of moderate intensity exercise per week and tracking your fiber intake.")
        elif bmi_cat == 'Underweight':
            return (f"Being in the {bmi_cat} category (BMI {bmi}) suggests we should focus on healthy weight gain. "
                    "Prioritize high-quality proteins and complex carbohydrates. Strength training is also vital to ensure the weight you gain is lean muscle.")
        else:
            return (f"You're currently in the {bmi_cat} range, which is excellent! To maintain this, focus on consistency. "
                    "Vary your workouts and ensure you're getting adequate sleep—recovery is as important as the exercise itself.")

    # Disparity between BMI and BAI
    if any(word in msg for word in ['different', 'conflict', 'not match']):
        if bmi_cat != bai_cat:
            return (f"Good observation. Your BMI says {bmi_cat} but your BAI says {bai_cat}. "
                    "This often happens in people with unique body types, like athletes with high muscle mass or 'skinny fat' profiles. "
                    "In your case, I'd suggest focusing more on the BAI if you've been doing a lot of strength training.")
        return "Your BMI and BAI categories actually agree! Both point towards a consistent assessment of your body composition."

    # Age/Gender specific
    if 'age' in msg or 'gender' in msg:
        return (f"Age and gender are crucial context. At {age}, your body's metabolic rate and fat distribution patterns are specific. "
                f"As a {gender}, your BAI targets ({bai}%) are different than they would be for another gender. "
                "The clinical standards I use (WHO/Asian) account for these demographic factors.")

    # Specific health conditions (safety first)
    if any(word in msg for word in ['diabetes', 'heart', 'pressure', 'disease', 'sick']):
        return ("While I can analyze your BMI and BAI, I cannot diagnose or treat medical conditions. "
                f"However, having a BMI of {bmi} ({bmi_cat}) can be a risk factor for various conditions. "
                "Please consult a medical professional for a comprehensive health screening.")

    # Catch-all
    responses = [
        f"Regarding your {bmi_cat} status: clinical studies show that small, incremental changes are the most sustainable. What's one habit you'd like to change this week?",
        f"I'm looking at your data... With a BMI of {bmi} and a BAI of {bai}%, you have a solid starting point for tracking progress. What are your specific fitness goals?",
        f"Interesting question. Given your current metrics, I'd say focusing on body composition rather than just the number on the scale will give you the best long-term results.",
        "Could you tell me more about your current activity level? That would help me tailor my advice to your lifestyle."
    ]
    return random.choice(responses)

def get_category_advice(category):
    advice = {
        "Underweight": "This may indicate you're not consuming enough calories for your height.",
        "Normal": "You are within the healthy weight range for your height.",
        "Overweight": "This indicates an increased risk of developing certain health problems.",
        "Obese": "This indicates a significantly higher risk of weight-related health issues."
    }
    return advice.get(category, "")
