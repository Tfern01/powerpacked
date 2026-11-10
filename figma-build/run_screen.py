#!/usr/bin/env python3
"""Run a screen build script (common.js + screen file) against the Figma file."""
import json, subprocess, sys, os

BASE = os.path.dirname(os.path.abspath(__file__))
FILE_KEY = "0BfmmJEZ2IHL0Np1xeG72b"
SKILLS = "resource:figma-use,resource:figma-generate-design"

screen_path = sys.argv[1]
desc = sys.argv[2] if len(sys.argv) > 2 else "use_figma build step"
common = open(os.path.join(BASE, "common.js")).read()
screen = open(screen_path).read()
code = common + "\n" + screen

tmp = os.path.join(BASE, "_combined_tmp.js")
open(tmp, "w").write(code)
print(f"combined {len(code)} chars -> {tmp}")
proc = subprocess.run(
    ["python3", os.path.join(BASE, "run_use_figma.py"), tmp, desc],
    capture_output=True, text=True, timeout=300,
)
print(proc.stdout)
print(proc.stderr, file=sys.stderr)
