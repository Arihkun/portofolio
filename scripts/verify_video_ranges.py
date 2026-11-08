"""Check Safari byte-range probes against the exact MP4 files deployed."""
import asyncio
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3192"


async def main():
    results = []
    async with async_playwright() as p:
        request = await p.request.new_context()
        for name in ["koii", "kasmate"]:
            data = Path(f"public/media/{name}-demo-v3.mp4").read_bytes()
            assert len(data) <= 2 * 1024 * 1024
            url = BASE + f"/media/{name}-demo-v3.mp4"
            full = await request.get(url)
            assert full.status == 200 and await full.body() == data
            head = await request.head(url)
            assert head.status == 200 and int(head.headers["content-length"]) == len(data)
            assert head.headers["accept-ranges"] == "bytes"
            cases = [("bytes=0-1", 0, 1), ("bytes=0-1023", 0, 1023), ("bytes=-1024", len(data)-1024, len(data)-1), (f"bytes={len(data)-100}-", len(data)-100, len(data)-1), (f"bytes={len(data)-10}-{len(data)+100}", len(data)-10, len(data)-1)]
            for value, start, end in cases:
                response = await request.get(url, headers={"Range": value})
                assert response.status == 206, (name, value, response.status)
                assert response.headers["content-range"] == f"bytes {start}-{end}/{len(data)}"
                assert int(response.headers["content-length"]) == end-start+1
                assert await response.body() == data[start:end+1]
            for value in [f"bytes={len(data)}-", "bytes=10-1", "bytes=-0"]:
                response = await request.get(url, headers={"Range": value})
                assert response.status == 416
                assert response.headers["content-range"] == f"bytes */{len(data)}"
            for validator, status in [(full.headers["etag"], 206), ('"old-version"', 200)]:
                response = await request.get(url, headers={"Range": "bytes=0-1", "If-Range": validator})
                assert response.status == status
            results.append({"clip": name, "size": len(data), "passed": True})
        await request.dispose()
    out = Path("artifacts/iphone-resume")
    out.mkdir(parents=True, exist_ok=True)
    suffix = "production" if BASE.startswith("https:") else "local"
    (out / f"range-checks-{suffix}.json").write_text(json.dumps({"base": BASE, "clips": results}, indent=2))
    print("PASS full GET, HEAD, Safari probes, prefix/suffix/open ranges, 416 and If-Range for both demos.")


if __name__ == "__main__":
    asyncio.run(main())
