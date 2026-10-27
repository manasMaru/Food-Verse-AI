from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import mimetypes
import os
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"

FOODS = {
    "apple": {"calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3, "fiber": 4.4},
    "banana": {"calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.4, "fiber": 3.1},
    "rice": {"calories": 206, "protein": 4.3, "carbs": 45, "fat": 0.4, "fiber": 0.6},
    "roti": {"calories": 120, "protein": 3.5, "carbs": 22, "fat": 3, "fiber": 3},
    "dal": {"calories": 180, "protein": 11, "carbs": 28, "fat": 3, "fiber": 8},
    "egg": {"calories": 78, "protein": 6.3, "carbs": 0.6, "fat": 5.3, "fiber": 0},
    "chicken": {"calories": 239, "protein": 27, "carbs": 0, "fat": 14, "fiber": 0},
    "paneer": {"calories": 265, "protein": 18, "carbs": 4, "fat": 20, "fiber": 0},
    "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fat": 10, "fiber": 2.5},
    "salad": {"calories": 80, "protein": 3, "carbs": 14, "fat": 2, "fiber": 5},
    "milk": {"calories": 122, "protein": 8, "carbs": 12, "fat": 5, "fiber": 0},
    "oats": {"calories": 150, "protein": 5, "carbs": 27, "fat": 3, "fiber": 4},
    "poha": {"calories": 250, "protein": 5, "carbs": 45, "fat": 7, "fiber": 3},
    "idli": {"calories": 58, "protein": 2, "carbs": 12, "fat": 0.4, "fiber": 0.5},
    "samosa": {"calories": 260, "protein": 4, "carbs": 32, "fat": 13, "fiber": 3},
}

def json_response(handler, payload, status=200):
    raw = json.dumps(payload).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(raw)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.end_headers()
    handler.wfile.write(raw)

def read_json(handler):
    length = int(handler.headers.get("Content-Length", "0"))
    if length > 1_000_000:
        raise ValueError("Request too large")
    raw = handler.rfile.read(length) if length else b"{}"
    return json.loads(raw.decode("utf-8") or "{}")

def find_food(name):
    name = (name or "").lower()
    for food, values in FOODS.items():
        if food in name:
            return food, values
    return None, None

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if urlparse(self.path).path == "/api/health":
            return json_response(self, {"status": "ok", "app": "Food Verse AI"})
        if urlparse(self.path).path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        route = urlparse(self.path).path
        try:
            data = read_json(self)
            if route == "/api/nutrition":
                name = data.get("food", "")
                food, nutrition = find_food(name)
                if not food:
                    return json_response(self, {
                        "ok": False,
                        "message": "Food not in the demo database yet. Try apple, banana, rice, roti, dal, egg, chicken, paneer, pizza, salad, milk, oats, poha, idli or samosa."
                    }, 200)
                servings = max(0.25, min(float(data.get("servings", 1)), 10))
                scaled = {k: round(v * servings, 1) for k, v in nutrition.items()}
                return json_response(self, {
                    "ok": True, "food": food.title(), "servings": servings,
                    "nutrition": scaled,
                    "note": "Approximate demo values per selected serving; real nutrition varies by recipe, size and preparation."
                })
            if route == "/api/cooking":
                ingredients = [x.strip().lower() for x in data.get("ingredients", "").split(",") if x.strip()]
                if not ingredients:
                    return json_response(self, {"ok": False, "message": "Enter at least one ingredient."})
                ideas = []
                joined = " ".join(ingredients)
                if any(x in joined for x in ["rice", "dal", "lentil"]):
                    ideas.append({"name": "Comfort dal-rice bowl", "steps": ["Cook the rice until tender.", "Simmer dal with spices until soft.", "Serve together; add vegetables or lemon if available."]})
                if any(x in joined for x in ["egg", "tomato", "onion"]):
                    ideas.append({"name": "Quick masala omelette", "steps": ["Beat eggs with chopped vegetables.", "Season with salt and spices.", "Cook in a lightly oiled pan until fully set."]})
                if any(x in joined for x in ["paneer", "capsicum", "pepper"]):
                    ideas.append({"name": "Paneer and pepper stir-fry", "steps": ["Cut paneer and vegetables into bite-size pieces.", "Sauté with spices for 5–7 minutes.", "Serve with roti or rice if available."]})
                if any(x in joined for x in ["oats", "milk", "banana", "apple"]):
                    ideas.append({"name": "Easy breakfast bowl", "steps": ["Cook oats in milk or water.", "Top with sliced fruit.", "Add nuts or seeds if available."]})
                if not ideas:
                    ideas.append({"name": "Simple mixed-ingredient skillet", "steps": ["Wash and prepare the ingredients.", "Cook ingredients that need the longest time first.", "Season to taste and ensure meat or eggs are fully cooked."]})
                return json_response(self, {"ok": True, "ideas": ideas[:3], "disclaimer": "Recipe ideas are generated by simple rules, not an AI chef."})
            if route == "/api/meal-plan":
                preference = data.get("preference", "balanced")
                plans = {
                    "balanced": [
                        ("Breakfast", "Oats with milk and banana"),
                        ("Lunch", "Dal, rice, roti and salad"),
                        ("Snack", "Apple or seasonal fruit"),
                        ("Dinner", "Paneer or chicken with vegetables and roti")
                    ],
                    "vegetarian": [
                        ("Breakfast", "Poha with peas"),
                        ("Lunch", "Dal, rice, roti and salad"),
                        ("Snack", "Milk and fruit"),
                        ("Dinner", "Paneer with vegetables and roti")
                    ],
                    "high-protein": [
                        ("Breakfast", "Eggs or paneer with oats"),
                        ("Lunch", "Dal, rice and paneer or chicken"),
                        ("Snack", "Milk and roasted chana"),
                        ("Dinner", "Paneer or chicken with vegetables")
                    ]
                }
                return json_response(self, {"ok": True, "preference": preference, "meals": plans.get(preference, plans["balanced"]), "note": "General demo suggestions, not medical or dietetic advice. Adjust portions to your needs."})
            if route == "/api/analyze-media":
                filename = data.get("filename", "uploaded file")
                media_type = data.get("mediaType", "image")
                return json_response(self, {
                    "ok": True,
                    "filename": filename,
                    "mediaType": media_type,
                    "title": "Upload received",
                    "findings": [
                        "The file was selected successfully in the browser.",
                        "This starter version does not run a trained vision or speech model.",
                        "Use the food name field for nutrition estimates and the hygiene checklist for a structured review."
                    ],
                    "status": "Prototype workflow only"
                })
            if route == "/api/hygiene":
                checks = data.get("checks", {})
                checked = [label for label, value in checks.items() if value]
                total = len(checks)
                score = round((len(checked) / total) * 100) if total else 0
                return json_response(self, {
                    "ok": True, "score": score, "checked": checked,
                    "summary": "Checklist completion score only—not a certified hygiene rating.",
                    "recommendations": [
                        "Observe handwashing and glove changes during food handling.",
                        "Keep raw and ready-to-eat foods separate.",
                        "Check food storage temperatures and cleaning records.",
                        "Treat any suspected contamination as a reason to stop serving and investigate."
                    ]
                })
            return json_response(self, {"ok": False, "message": "Unknown API route."}, 404)
        except (ValueError, json.JSONDecodeError) as exc:
            return json_response(self, {"ok": False, "message": str(exc)}, 400)
        except Exception as exc:
            return json_response(self, {"ok": False, "message": "Server error: " + str(exc)}, 500)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)

    print(f"Food Verse AI is running on port {port}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
