from flask import Flask, request, jsonify, render_template
from flask_cors import CORS   # type: ignore
import os

app = Flask(__name__)
CORS(app)  

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/submit", methods=["POST"])
def submit_form():
    name = request.form.get("name")
    age = request.form.get("age")
    file = request.files.get("file")
    
    if not (name and age and file):
        return jsonify({"error": "All fields are required"}), 400

    # Save the uploaded file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    return jsonify({
        "message": "Form submitted successfully",
        "name": name,
        "age": age,
        "file": file.filename
    })

if __name__ == '__main__':  
    app.run(debug=True, port=8000)

