import json, os

with open(os.environ["GOOGLE_APPLICATION_CREDENTIALS"]) as f:
    data = json.load(f)

# print(data["type"])