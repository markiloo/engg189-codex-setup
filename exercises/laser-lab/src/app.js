(function (root) {
  "use strict";

  var S = root.LaserLabScene;
  var T = root.LaserLabTrace;
  var R = root.LaserLabRender;
  var I = root.LaserLabInteraction;

  function esc(value) { return String(value).replace(/[&<>\"]/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[char]; }); }
  function degrees(rad) { return Math.round(rad * 180 / Math.PI); }

  function mount(rootNode) {
    var svg = rootNode.querySelector("#bench");
    var inspector = rootNode.querySelector("#inspector-content");
    var scene = S.createDefaultScene();
    var trace = T.traceScene(scene);
    var cleanup;
    var liveTrace = true;

    function selected() { return S.findElement(scene, scene.selectedId); }
    function redraw(shouldTrace) {
      if (shouldTrace) trace = T.traceScene(scene);
      R.renderBench(svg, scene, trace);
      renderInspector();
    }
    function setScene(next, shouldTrace) { scene = next; redraw(shouldTrace !== false); }
    function control(label, field, value, min, max, step, type) {
      var inputType = type || "range";
      if (inputType === "number") return '<div class="control-group"><label class="control-label" for="field-' + field + '"><span>' + label + '</span><input class="number-control" id="field-' + field + '" data-field="' + field + '" type="number" value="' + esc(value) + '" step="' + step + '"></label></div>';
      return '<div class="control-group"><label class="control-label" for="field-' + field + '"><span>' + label + '</span><span class="control-value" data-value-for="' + field + '">' + esc(value) + '</span></label><input class="range-control" id="field-' + field + '" data-field="' + field + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"></div>';
    }
    function renderInspector() {
      var item = selected();
      rootNode.querySelector("#inspector-title").textContent = item ? item.kind : "No selection";
      rootNode.querySelector("#inspector-index").textContent = item ? item.id : "—";
      if (!item) { inspector.innerHTML = '<p class="empty-state">Select a laser, mirror, target, lens, or point source on the bench to inspect its parameters.</p>'; return; }
      var html = '';
      if (item.kind === "laser") {
        html += control("X position", "x", Math.round(item.position.x), 20, 940, 1, "number");
        html += control("Y position", "y", Math.round(item.position.y), 20, 520, 1, "number");
        html += control("Angle", "angle", degrees(item.angleRad), -180, 180, 1);
        html += control("Wavelength", "wavelength", item.wavelengthNm, 400, 700, 1);
      }
      if (item.kind === "mirror") {
        html += control("X position", "x", Math.round(item.center.x), 20, 940, 1, "number");
        html += control("Y position", "y", Math.round(item.center.y), 20, 520, 1, "number");
        html += control("Angle", "angle", degrees(item.angleRad), -180, 180, 1);
        html += control("Length", "length", Math.round(item.length), 40, 260, 1);
      }
      if (item.kind === "target") {
        html += control("X position", "x", Math.round(item.center.x), 20, 940, 1, "number");
        html += control("Y position", "y", Math.round(item.center.y), 20, 520, 1, "number");
        html += control("Radius", "radius", Math.round(item.radius), 10, 60, 1);
      }
      if (item.kind === "lens") {
        html += control("X position", "x", Math.round(item.center.x), 20, 940, 1, "number");
        html += control("Y position", "y", Math.round(item.center.y), 20, 520, 1, "number");
        html += control("Angle", "angle", degrees(item.angleRad), -180, 180, 1);
        html += control("Length", "length", Math.round(item.length), 40, 260, 1);
        html += control("Focal length", "focalLength", Math.round(item.focalLength), -500, 500, 1, "number");
      }
      if (item.kind === "point-source") {
        html += control("X position", "x", Math.round(item.position.x), 20, 940, 1, "number");
        html += control("Y position", "y", Math.round(item.position.y), 20, 520, 1, "number");
        html += control("Angle", "angle", degrees(item.angleRad), -180, 180, 1);
        html += control("Spread", "spread", Math.round(item.spreadRad * 180 / Math.PI), 0, 90, 1, "number");
        html += control("Ray count", "rayCount", item.rayCount, 3, 7, 1, "number");
      }
      html += '<div class="inspector-divider"></div><p class="inspector-note">Use arrow keys to nudge. Press Q or E to rotate. The current model uses ideal geometric rays.</p><button class="delete-button" data-action="delete">Remove ' + esc(item.kind) + '</button>';
      inspector.innerHTML = html;
      Array.prototype.forEach.call(inspector.querySelectorAll("[data-field]"), function (input) { input.addEventListener("input", onFieldInput); });
      var deleteButton = inspector.querySelector("[data-action=delete]");
      if (deleteButton) deleteButton.addEventListener("click", function () { setScene(S.removeElement(scene, item.id)); });
    }
    function onFieldInput(event) {
      var item = selected(); if (!item) return;
      var field = event.target.getAttribute("data-field"); var value = Number(event.target.value); var patch = {};
      if (field === "x" || field === "y") {
        var position = item.position || item.center; position = { x: position.x, y: position.y }; position[field] = value; patch[item.position ? "position" : "center"] = position;
      } else if (field === "angle") patch.angleRad = value * Math.PI / 180;
      else if (field === "spread") patch.spreadRad = value * Math.PI / 180;
      else patch[field] = value;
      setScene(S.updateElement(scene, item.id, patch));
    }
    function move(id, delta) {
      var item = S.findElement(scene, id); if (!item) return;
      var key = item.position ? "position" : "center"; var position = item[key];
      setScene(S.updateElement(scene, id, { [key]: { x: position.x + delta.x, y: position.y + delta.y } }), liveTrace);
    }
    function rotate(id, delta) {
      var item = S.findElement(scene, id); if (!item || item.angleRad == null) return;
      setScene(S.updateElement(scene, id, { angleRad: item.angleRad + delta }));
    }
    function select(id) {
      if (!S.findElement(scene, id)) return;
      scene = Object.assign({}, scene, { selectedId: id });
      redraw(false);
    }
    cleanup = I.bindBenchInteractions(svg, { getSelectedId: function () { return scene.selectedId; }, select: select, move: move, rotate: rotate, commit: function () { redraw(true); }, remove: function (id) { setScene(S.removeElement(scene, id)); } });

    Array.prototype.forEach.call(rootNode.querySelectorAll("[data-add]"), function (button) { button.addEventListener("click", function () { setScene(S.addElement(scene, button.getAttribute("data-add"))); }); });
    rootNode.querySelector("[data-action=reset]").addEventListener("click", function () { setScene(S.createDefaultScene()); });
    rootNode.querySelector("[data-action=trace]").addEventListener("click", function () { redraw(true); });
    var liveTraceControl = rootNode.querySelector("#live-trace");
    if (liveTraceControl) liveTraceControl.addEventListener("change", function () { liveTrace = liveTraceControl.checked; if (liveTrace) redraw(true); });
    redraw(true);
    return { getScene: function () { return scene; }, setScene: function (next) { setScene(next); }, reset: function () { setScene(S.createDefaultScene(), "Scene reset"); }, destroy: cleanup };
  }

  root.LaserLabApp = { mount: mount };
  document.addEventListener("DOMContentLoaded", function () { var rootNode = document.getElementById("laser-lab"); if (rootNode) mount(rootNode); });
})(window);
