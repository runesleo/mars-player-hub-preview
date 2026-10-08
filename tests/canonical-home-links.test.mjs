import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "start.html", "tools.html", "faq.html", "updates.html", "wallet.html"];

test("all Mars Player Hub pages link home to the canonical directory URL", () => {
  for (const page of pages) {
    const html = readFileSync(join(root, page), "utf8");
    assert.match(html, /<a class="brand" href="\.\/">/, page);
    assert.doesNotMatch(html, /href=["'](?:\.\/)?index\.html["']/, page);
  }
});

test("home navigation works on custom domain and GitHub Pages preview", () => {
  const bases = [
    "https://mars.leolabs.me/",
    "https://runesleo.github.io/mars-player-hub-preview/",
  ];
  for (const base of bases) {
    for (const page of pages) {
      assert.equal(new URL("./", new URL(page, base)).href, base, `${base} ${page}`);
    }
  }
});
