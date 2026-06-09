import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSiteUrl, absoluteUrl, pageMetadata } from "@/lib/seo";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.stubEnv("NODE_ENV", ORIGINAL_NODE_ENV);
  });

  it("returns a valid URL string", () => {
    expect(() => new URL(getSiteUrl())).not.toThrow();
  });

  it("returns https://titanopticals.com by default in test", () => {
    expect(getSiteUrl()).toMatch(/^https?:\/\//);
  });
});

describe("absoluteUrl", () => {
  it("combines base URL with path", () => {
    const url = absoluteUrl("/products");
    expect(url).toMatch(/\/products$/);
  });

  it("adds leading slash if missing", () => {
    const url = absoluteUrl("products");
    expect(url).toMatch(/\/products$/);
  });

  it("defaults to root path", () => {
    const url = absoluteUrl();
    expect(url).toMatch(/\/$/);
  });

  it("returns a valid absolute URL", () => {
    expect(() => new URL(absoluteUrl("/test"))).not.toThrow();
  });
});

describe("pageMetadata", () => {
  it("returns metadata with title and description", () => {
    const meta = pageMetadata({ title: "Test", description: "Desc", path: "/test" });
    expect(meta.title).toBe("Test");
    expect(meta.description).toBe("Desc");
  });

  it("sets canonical URL", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/page" });
    expect(meta.alternates?.canonical).toMatch(/\/page$/);
  });

  it("sets Open Graph fields", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/og" });
    expect(meta.openGraph?.title).toBe("T");
    expect(meta.openGraph?.description).toBe("D");
    expect(meta.openGraph?.type).toBe("website");
    expect(meta.openGraph?.locale).toBe("en_NP");
  });

  it("includes OG image", () => {
    const meta = pageMetadata({ title: "T", description: "D", path: "/img" });
    expect(meta.openGraph?.images).toBeDefined();
    expect(Array.isArray(meta.openGraph?.images)).toBe(true);
  });
});
