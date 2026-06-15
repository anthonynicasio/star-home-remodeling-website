import pathlib, re, json
p = pathlib.Path(r"C:\Users\Tony\.cursor\projects\1781552923026\agent-transcripts\74eb122d-4e5d-4569-9660-eb293b0a3ee3\74eb122d-4e5d-4569-9660-eb293b0a3ee3.jsonl")
lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
print("total lines", len(lines))
for i, l in enumerate(lines):
    if "here are some images" in l.lower():
        print("found line", i+1, "size", len(l))
        try:
            obj = json.loads(l)
            print("keys", obj.keys())
            content = obj.get("message", {}).get("content", [])
            print("content types", [c.get("type") for c in content if isinstance(c, dict)])
            for c in content:
                if isinstance(c, dict) and c.get("type") == "image":
                    print("image keys", c.keys())
        except Exception as e:
            print("json err", e)
            print(l[:500])
