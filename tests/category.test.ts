import { test } from "node:test";
import assert from "node:assert/strict";
import { categoryFromLabels } from "../lib/category.ts";

test("categoryFromLabels picks the first matching bucket, beach before park", () => {
  assert.equal(categoryFromLabels(["Sky", "Beach", "Tree"]), "beach");
  assert.equal(categoryFromLabels(["Street food", "Noodle"]), "food");
  assert.equal(categoryFromLabels(["Wall", "Graffiti"]), "art");
  assert.equal(categoryFromLabels(["Rooftop", "Plant", "Sky"]), "park");
  assert.equal(categoryFromLabels(["Skyscraper", "Night"]), "landmark");
  assert.equal(categoryFromLabels(["Cat", "Whiskers"]), "other");
  assert.equal(categoryFromLabels([]), "other");
});
