(function (root) {
  "use strict";

  var S = root.LaserLabScene = root.LaserLabScene || {};
  var G = root.LaserLabGeometry;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  S.createDefaultScene = function () {
    return {
      schemaVersion: 1,
      bounds: { minX: 0, minY: 0, maxX: 960, maxY: 540 },
      elements: [
        { id: "laser-1", kind: "laser", position: { x: 110, y: 270 }, angleRad: 0, wavelengthNm: 635, intensity: 1, enabled: true },
        { id: "mirror-1", kind: "mirror", center: { x: 420, y: 270 }, angleRad: -Math.PI / 4, length: 128 },
        { id: "target-1", kind: "target", center: { x: 420, y: 120 }, radius: 24 }
      ],
      selectedId: "mirror-1"
    };
  };

  S.findElement = function (scene, id) {
    return scene.elements.filter(function (element) { return element.id === id; })[0] || null;
  };

  S.validateScene = function (scene) {
    var errors = [];
    if (!scene || scene.schemaVersion !== 1) errors.push("schemaVersion must be 1");
    if (!scene || !scene.bounds) errors.push("bounds are required");
    if (!scene || !Array.isArray(scene.elements)) errors.push("elements must be an array");
    if (scene && Array.isArray(scene.elements)) {
      var ids = {};
      scene.elements.forEach(function (element) {
        if (!element.id || ids[element.id]) errors.push("element ids must be unique");
        ids[element.id] = true;
        if (["laser", "mirror", "target"].indexOf(element.kind) < 0) errors.push("unsupported element kind");
      });
    }
    return { ok: errors.length === 0, errors: errors };
  };

  S.updateElement = function (scene, id, patch) {
    var next = clone(scene);
    var element = S.findElement(next, id);
    if (!element) return next;
    Object.keys(patch).forEach(function (key) {
      element[key] = typeof patch[key] === "object" && patch[key] !== null ? clone(patch[key]) : patch[key];
    });
    return next;
  };

  S.addElement = function (scene, kind) {
    var next = clone(scene);
    var index = next.elements.length + 1;
    var element;
    if (kind === "laser") element = { id: "laser-" + index, kind: "laser", position: { x: 150, y: 120 + index * 24 }, angleRad: 0, wavelengthNm: 635, intensity: 1, enabled: true };
    if (kind === "mirror") element = { id: "mirror-" + index, kind: "mirror", center: { x: 520, y: 230 + index * 20 }, angleRad: -Math.PI / 4, length: 128 };
    if (kind === "target") element = { id: "target-" + index, kind: "target", center: { x: 760, y: 170 + index * 18 }, radius: 24 };
    if (!element) return next;
    next.elements.push(element);
    next.selectedId = element.id;
    return next;
  };

  S.removeElement = function (scene, id) {
    var next = clone(scene);
    next.elements = next.elements.filter(function (element) { return element.id !== id; });
    if (next.selectedId === id) next.selectedId = next.elements[0] ? next.elements[0].id : null;
    return next;
  };
})(window);
