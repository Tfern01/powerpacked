#!/usr/bin/env python3
"""Run a use_figma JS file against the Powerpacked Figma file."""
import json, subprocess, sys

FILE_KEY = "0BfmmJEZ2IHL0Np1xeG72b"
SKILLS = "resource:figma-use,resource:figma-generate-design"

js_path = sys.argv[1]
desc = sys.argv[2] if len(sys.argv) > 2 else "use_figma build step"
code = open(js_path).read()

args = {
    "fileKey": FILE_KEY,
    "description": desc,
    "code": code,
    "skillNames": SKILLS,
}
proc = subprocess.run(
    ["/opt/hatch/bin/figma", "call-tool", "--name", "use_figma", "--arguments-json", json.dumps(args)],
    capture_output=True, text=True, timeout=300,
)
out = proc.stdout
try:
    d = json.loads(out)
    res = d.get("result", {})
    content = res.get("content", [])
    for c in content:
        print(c.get("text", "")[:6000])
    if not content:
        print(out[:6000])
except Exception:
    print(out[:6000])
    print(proc.stderr[:2000], file=sys.stderr)
