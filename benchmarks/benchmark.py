import time
import json
import urllib.request
import datetime

def make_request(url, method='POST', payload=None):
    req = urllib.request.Request(url, method=method)
    if payload:
        req.data = json.dumps(payload).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
    try:
        start = time.time()
        with urllib.request.urlopen(req) as response:
            body = response.read()
            end = time.time()
            return json.loads(body.decode('utf-8')) if body else {}, response.status, end - start
    except Exception as e:
        return {"error": str(e)}, 500, 0

print("Starting LLM Output Arbitration Benchmark...")

results = {
    "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    "metrics": {}
}

base_url = "http://localhost:4000/api/v1"

payload = {
    "originalPrompt": "Write a python script to parse logs.",
    "originalOutput": "def parse_logs(): pass"
}

print("Running arbitration...")
response_data, status, duration = make_request(f"{base_url}/arbitrate", 'POST', payload)

results["metrics"]["arbitration_latency_s"] = round(duration, 4)
results["metrics"]["status"] = status
results["metrics"]["response"] = response_data
results["metrics"]["success"] = status == 200

output_file = f"benchmarks/results_{int(time.time())}.json"
with open(output_file, "w") as f:
    json.dump(results, f, indent=2)

print(f"Benchmark completed successfully. Results saved to {output_file}")
