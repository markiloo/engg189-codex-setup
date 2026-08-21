(function (root) {
  "use strict";

  var R = root.LaserLabRender = root.LaserLabRender || {};
  var SVG_NS = "http://www.w3.org/2000/svg";
  var T = root.LaserLabTrace;

  function element(name, attributes) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attributes || {}).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function point(value) { return Number(value).toFixed(2); }
  function degrees(rad) { return rad * 180 / Math.PI; }

  function renderRays(trace) {
    var effects = document.getElementById("beam-effects");
    var core = document.getElementById("beam-core");
    clear(effects); clear(core);
    trace.segments.forEach(function (segment) {
      var attrs = { x1: point(segment.from.x), y1: point(segment.from.y), x2: point(segment.to.x), y2: point(segment.to.y) };
      effects.appendChild(element("line", Object.assign({ class: "beam-aura" }, attrs)));
      effects.appendChild(element("line", Object.assign({ class: "beam-glow" }, attrs)));
      core.appendChild(element("line", Object.assign({ class: "beam-line" }, attrs)));
      core.appendChild(element("line", Object.assign({ class: "beam-highlight" }, attrs)));
      if (segment.terminatedBy === "target") core.appendChild(element("circle", { class: "beam-endpoint", cx: point(segment.to.x), cy: point(segment.to.y), r: 5 }));
    });
  }

  function renderLaser(group, laser) {
    group.setAttribute("transform", "translate(" + point(laser.position.x) + " " + point(laser.position.y) + ") rotate(" + point(degrees(laser.angleRad)) + ")");
    group.appendChild(element("rect", { class: "laser-body", x: -30, y: -13, width: 42, height: 26, rx: 7 }));
    group.appendChild(element("rect", { class: "laser-stripe", x: -25, y: -9, width: 5, height: 18, rx: 2 }));
    group.appendChild(element("circle", { class: "laser-aura", cx: 18, cy: 0, r: 16 }));
    group.appendChild(element("circle", { class: "laser-aperture-glow", cx: 18, cy: 0, r: 9 }));
    group.appendChild(element("circle", { class: "laser-aperture", cx: 18, cy: 0, r: 5 }));
    group.appendChild(element("line", { class: "laser-emitter", x1: 23, y1: 0, x2: 33, y2: 0 }));
    group.appendChild(element("text", { class: "laser-label", x: -17, y: 3.5, "text-anchor": "middle" })).textContent = "LASER";
    group.appendChild(element("circle", { class: "selection-handle", cx: -20, cy: 0, r: 3, opacity: 0.85 }));
  }

  function renderMirror(group, mirror) {
    var ends = T.mirrorEndpoints(mirror);
    group.setAttribute("transform", "translate(" + point(mirror.center.x) + " " + point(mirror.center.y) + ") rotate(" + point(degrees(mirror.angleRad)) + ")");
    group.appendChild(element("line", { class: "mirror-back", x1: -mirror.length / 2, y1: 0, x2: mirror.length / 2, y2: 0 }));
    group.appendChild(element("line", { class: "mirror-face", x1: -mirror.length / 2, y1: 0, x2: mirror.length / 2, y2: 0 }));
    group.appendChild(element("circle", { class: "selection-handle", cx: 0, cy: 0, r: 4, opacity: 0.9 }));
    group.setAttribute("aria-label", "Mirror at " + Math.round(mirror.center.x) + ", " + Math.round(mirror.center.y));
  }

  function renderTarget(group, target, trace) {
    var hit = trace.hits.some(function (item) { return item.targetId === target.id; });
    group.setAttribute("transform", "translate(" + point(target.center.x) + " " + point(target.center.y) + ")");
    group.classList.toggle("is-hit", hit);
    group.setAttribute("aria-label", hit ? "Target " + target.id + " hit" : "Target " + target.id);
    if (hit) {
      group.appendChild(element("circle", { class: "target-hit-aura", cx: 0, cy: 0, r: target.radius + 9 }));
      group.appendChild(element("text", { class: "target-hit-label", x: target.radius + 12, y: -target.radius - 10 })).textContent = "HIT";
    }
    group.appendChild(element("circle", { class: hit ? "target-ring target-ring-hit" : "target-ring", cx: 0, cy: 0, r: target.radius }));
    group.appendChild(element("circle", { class: hit ? "target-core target-core-hit" : "target-core", cx: 0, cy: 0, r: 7 }));
    group.appendChild(element("circle", { class: "selection-handle", cx: 0, cy: 0, r: 3, opacity: 0.8 }));
  }

  function renderSelection(layer, scene) {
    clear(layer);
    var selected = scene.elements.filter(function (element) { return element.id === scene.selectedId; })[0];
    if (!selected) return;
    if (selected.kind === "mirror") {
      layer.appendChild(element("rect", { class: "selection-outline", x: selected.center.x - selected.length / 2 - 10, y: selected.center.y - 10, width: selected.length + 20, height: 20, rx: 7, transform: "rotate(" + degrees(selected.angleRad) + " " + selected.center.x + " " + selected.center.y + ")" }));
    } else if (selected.kind === "laser") {
      layer.appendChild(element("rect", { class: "selection-outline", x: selected.position.x - 38, y: selected.position.y - 18, width: 58, height: 36, rx: 9, transform: "rotate(" + degrees(selected.angleRad) + " " + selected.position.x + " " + selected.position.y + ")" }));
    } else if (selected.kind === "target") {
      layer.appendChild(element("circle", { class: "selection-outline", cx: selected.center.x, cy: selected.center.y, r: selected.radius + 9 }));
    }
  }

  R.renderBench = function (svg, scene, trace) {
    var elementsLayer = document.getElementById("optical-elements");
    var selectionLayer = document.getElementById("selection-layer");
    clear(elementsLayer);
    renderRays(trace);
    scene.elements.forEach(function (item) {
      var group = element("g", { class: "optical-element", "data-element-id": item.id, tabindex: 0, role: "button" });
      group.setAttribute("aria-label", item.kind + " " + item.id);
      if (item.kind === "laser") renderLaser(group, item);
      if (item.kind === "mirror") renderMirror(group, item);
      if (item.kind === "target") renderTarget(group, item, trace);
      if (item.id === scene.selectedId) group.classList.add("is-selected");
      elementsLayer.appendChild(group);
    });
    renderSelection(selectionLayer, scene);
  };
})(window);
