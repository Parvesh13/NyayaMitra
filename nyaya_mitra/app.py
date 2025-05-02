from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import ollama
import json
import sys
from waitress import serve
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Server initialization
print("\n🔌 Backend server initializing...")
print("🔄 Loading AI models and data...")

# Load models and data
model = SentenceTransformer('all-MiniLM-L6-v2')

try:
    faiss_index = faiss.read_index("embeddings/index.faiss")
    print("✅ FAISS index loaded successfully")
except Exception as e:
    print(f"❌ Error loading FAISS index: {e}")
    sys.exit(1)

with open("embeddings/ipc_qa.json", "r", encoding="utf-8") as f:
    data = json.load(f)
questions = [item['question'] for item in data]
answers = [item['answer'] for item in data]

print("🤖 All models loaded successfully!")
print("🌐 Starting backend server...")

def similar(a, b):
    """Calculate text similarity ratio"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        request_data = request.get_json()
        if not request_data or 'query' not in request_data:
            return jsonify({"error": "Invalid request format"}), 400

        query = request_data['query'].strip().lower()
        print(f"📩 Received query: '{query}'")

        # 1. First check for exact matches
        exact_matches = []
        for i, q in enumerate(questions):
            if query == q.lower().strip():
                exact_matches.append(answers[i])
        
        if exact_matches:
            print("✅ Found exact match in dataset")
            return _cors_response(jsonify({
                "response": exact_matches[0],
                "source": "exact_dataset_match",
                "status": "success"
            }))

        # 2. Check for high similarity matches (>85% match)
        similar_matches = []
        for i, q in enumerate(questions):
            if similar(query, q) > 0.85:
                similar_matches.append({
                    "question": q,
                    "answer": answers[i],
                    "similarity": similar(query, q)
                })
        
        if similar_matches:
            print("⚠️ Found similar questions in dataset")
            best_match = max(similar_matches, key=lambda x: x['similarity'])
            return _cors_response(jsonify({
                "response": best_match['answer'],
                "source": "similar_dataset_match",
                "original_question": best_match['question'],
                "similarity_score": best_match['similarity'],
                "status": "success"
            }))

        # 3. Semantic search fallback
        print("🔍 No exact matches found, using semantic search...")
        query_vec = model.encode([query])
        query_vec = np.array(query_vec).astype(np.float32)
        D, I = faiss_index.search(query_vec, k=3)
        
        valid_results = []
        for i, score in zip(I[0], D[0]):
            if i < len(questions):
                valid_results.append({
                    'question': questions[i],
                    'answer': answers[i],
                    'score': float(score)
                })
        
        if not valid_results:
            print("⚠️ No relevant results found for query")
            return _cors_response(jsonify({
                "response": "This information is not available in our Indian legal database.",
                "status": "no_results_found"
            }))

        # Prepare context with most relevant first
        valid_results.sort(key=lambda x: x['score'])
        context_string = "\n\n".join([
            f"Question: {res['question']}\nAnswer: {res['answer']}"
            for res in valid_results[:3]  # Top 3 most relevant
        ])
        
        # Get LLM response with strict instructions
        print("⚡ Processing query with LLM...")
        response = ollama.chat(
            model='llama2',
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an Indian legal expert assistant. Respond ONLY using the provided context.\n"
                        "RULES:\n"
                        "1. Use the exact wording from context when possible\n"
                        "2. Never invent information\n"
                        "3. If unsure, say 'This information is not available in our legal records'\n"
                        "4. Always reference specific laws/sections when present in context"
                    )
                },
                {
                    "role": "user", 
                    "content": (
                        f"Legal Question: {query}\n\n"
                        f"Relevant Context:\n{context_string}\n\n"
                        "Provide a concise answer using ONLY the above context. "
                        "Include section numbers when available."
                    )
                }
            ]
        )

        print("✅ Query processed successfully")
        return _cors_response(jsonify({
            "response": response['message']['content'],
            "matches": valid_results[:3],
            "source": "semantic_search",
            "status": "success"
        }))

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return _cors_response(jsonify({
            "error": str(e),
            "status": "error"
        }), 500)

def _build_cors_preflight_response():
    response = jsonify({"status": "ready"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

def _cors_response(response, status_code=200):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, status_code

if __name__ == '__main__':
    print("\n🚀 Backend server ready and waiting for connections...")
    print("🔗 Frontend can now connect to http://localhost:5000")
    serve(app, host='0.0.0.0', port=5000)