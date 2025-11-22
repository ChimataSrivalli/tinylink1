"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [short, setShort] = useState("");

  async function createLink() {
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ targetUrl: url }),
    });

    const data = await res.json();
    setShort(data.shortUrl);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>TinyLink</h1>

      <input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: 8, width: 300 }}
      />

      <button onClick={createLink} style={{ marginLeft: 10 }}>
        Shorten
      </button>

      {short && (
        <p>
          Short URL: <a href={short}>{short}</a>
        </p>
      )}
    </div>
  );
}
