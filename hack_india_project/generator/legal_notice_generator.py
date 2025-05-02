from flask import Flask, render_template, request, send_file
import os
from utils.generate_notice import generate_notice

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.form.to_dict()
    filepath = generate_notice(data)
    return send_file(filepath, as_attachment=True)

if __name__ == "__main__":
    if not os.path.exists("generated"):
        os.makedirs("generated")
    app.run(debug=True)
