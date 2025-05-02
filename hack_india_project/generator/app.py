from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from utils.generate_notice import generate_notice  # Your document generation logic

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/generate", methods=["POST"])
def generate():
    try:
        # Get JSON data from React
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'landlord_name', 'landlord_address', 'tenant_name',
            'rental_address', 'monthly_rent', 'months_unpaid',
            'agreement_date', 'payment_days', 'vacate_days'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Generate document
        filepath = generate_notice(data)
        filename = os.path.basename(filepath)

        return jsonify({
            "success": True,
            "download_url": f"http://localhost:5200/download/{filename}",
            "filename": filename
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/download/<filename>", methods=["GET"])
def download(filename):
    try:
        return send_file(
            os.path.join("generated", filename),
            as_attachment=True,
            download_name=filename,  # Ensure proper download filename
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    os.makedirs("generated", exist_ok=True) 
    app.run(host='0.0.0.0', port=5200, debug=True)