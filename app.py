<<<<<<< HEAD
import streamlit as st
from PIL import Image

st.title("Room Decoration App")

# --- User Inputs ---
uploaded_file = st.file_uploader("Upload room photo", type=["jpg","png"])
room_size = st.text_input("Room Size (feet)")
occasion = st.selectbox("Occasion / Theme", ["Birthday Party", "Graduation Party", "Baby Shower"])
style = st.selectbox("Style Preference", ["Modern", "Boho", "Minimalist", "Cozy", "Elegant"])
materials = st.multiselect("Available Materials", ["Ribbons", "Balloons", "Lights", "Posters", "Flowers", "Cushions"])
budget = st.text_input("Budget (USD)")

# --- Generate prompt and show image ---
if uploaded_file:
    # Open and display uploaded image
    img = Image.open(uploaded_file)
    st.image(img, caption="Uploaded Room Photo", use_column_width=True)

    # Build prompt for Gemini 2.5 (or placeholder)
    materials_str = ", ".join(materials) if materials else "no specific materials"
    prompt = f"""
Edit the uploaded room photo for a {occasion} in a {style} style.
Room size: {room_size}.
Use these materials: {materials_str}.
Budget: ${budget}.
- Keep existing furniture and walls unchanged.
- Maintain realistic lighting and shadows.
- Preserve consistent object style (balloons, flowers, furniture).
"""
    st.subheader("Generated Prompt")
    st.text_area("", prompt, height=250)

    # Placeholder for edited image
    st.subheader("Edited Image (Placeholder)")
    st.image("https://placehold.co/600x400?text=Decorated+Room", use_column_width=True)
=======
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
from google import genai
from google.genai import types
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key="AIzaSyAIle7RYg0khaaN-Oo-890eJroGndF9I7M")

@app.route("/decorate", methods=["POST"])
def decorate():
    try:
        room_size = request.form.get("room_size", "medium")
        occasion = request.form.get("occasion", "party")
        style = request.form.get("style", "modern")
        materials = request.form.getlist("materials[]")
        budget = request.form.get("budget", "1000")
        image_file = request.files["image"]

        img = Image.open(image_file.stream)

        materials_str = ", ".join(materials) if materials else "no specific materials"

        image_prompt = f"""
        Transform this interior photo for a {occasion} in a {style} style.
        Room size: {room_size}.
        Use materials: {materials_str}.
        Keep architecture, furniture, and walls realistic.
        Add thematic decor, party props, and natural lighting adjustments.
        Maintain realistic reflections, textures, and consistent perspective.
        Ultra-detailed, photorealistic 8K render.
        """

        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format=img.format or 'PNG')
        img_byte_arr = img_byte_arr.getvalue()

        image_part = types.Part(
            inline_data=types.Blob(
                mime_type="image/png",
                data=img_byte_arr
            )
        )

        text_prompt = f"""
        You are an expert interior decorator.
        Create a detailed, step-by-step decoration plan for a {occasion} in a {style} style room.
        Room size: {room_size}.
        Budget: ${budget}.
        Available materials: {materials_str}.
        Ensure the plan fits within budget and includes DIY-friendly suggestions.
        Mention lighting, table decor, and spatial flow improvements.
        Do not use any markdown. I just want plain text and indents for new lines.
        """

        text_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=text_prompt,
        )

        text_plan = ""
        for part in text_response.candidates[0].content.parts:
            if getattr(part, "text", None):
                text_plan += part.text + "\n"

        image_response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[image_prompt, image_part],
        )

        generated_image_base64 = None
        for part in image_response.candidates[0].content.parts:
            if getattr(part, "inline_data", None):
                image_bytes = part.inline_data.data
                generated_image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        if not generated_image_base64:
            raise ValueError("No image returned from Gemini image model.")

        return jsonify({
            "status": "success",
            "text_plan": text_plan.strip(),
            "image_base64": generated_image_base64
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)