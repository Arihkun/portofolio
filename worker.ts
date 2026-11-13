import app from "vinext/server/fetch-handler";
export * from "vinext/server/fetch-handler";

type AssetEnvironment = {
  ASSETS: { fetch(request: Request): Promise<Response> };
};

export default {
  async fetch(request: Request, env: AssetEnvironment, context: unknown) {
    const pathname = new URL(request.url).pathname;
    if (!/^\/media\/(?:(?:koii|kasmate)-demo-v[234]|undangan-demo)\.mp4$/.test(pathname) || !["GET", "HEAD"].includes(request.method)) {
      return app.fetch(request, env, context);
    }

    const range = request.headers.get("Range");
    const ifRange = request.headers.get("If-Range");
    const assetRequest = new Request(request, { method: "GET" });
    assetRequest.headers.delete("Range");
    assetRequest.headers.delete("If-Range");
    const asset = await env.ASSETS.fetch(assetRequest);
    if (asset.status !== 200) return asset;

    const headers = new Headers(asset.headers);
    headers.set("Accept-Ranges", "bytes");
    const validatorMatches = !ifRange || (!ifRange.startsWith("W/") && [headers.get("ETag"), headers.get("Last-Modified")].includes(ifRange));
    const match = range?.match(/^bytes=(\d*)-(\d*)$/);
    if (request.method !== "HEAD" && (!match || !validatorMatches)) {
      return new Response(asset.body, { status: 200, headers });
    }

    // Only the curated demo clips enter this path; their size is checked before deployment.
    const bytes = await asset.arrayBuffer();
    const length = bytes.byteLength;
    headers.set("Content-Length", String(length));
    if (request.method === "HEAD") return new Response(null, { status: 200, headers });
    if (!match || length > 2 * 1024 * 1024) return new Response(bytes, { status: 200, headers });

    const suffix = match[1] === "";
    const start = suffix ? Math.max(0, length - Number(match[2])) : Number(match[1]);
    const end = suffix || match[2] === "" ? length - 1 : Math.min(Number(match[2]), length - 1);
    if ((!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= length || end < start || (suffix && Number(match[2]) === 0)) {
      headers.set("Content-Range", `bytes */${length}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }

    headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  },
};
