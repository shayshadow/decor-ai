import streamlit as st
from PIL import Image

st.title("Room Decoration App")

# --- User Inputs ---
uploaded_file = st.file_uploader("Upload room photo", type=["jpg","png"])
room_size = st.text_input("Room Size")
occasion = st.selectbox("Occasion / Theme", ["Birthday Party", "Wedding", "Cozy Dinner"])
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
