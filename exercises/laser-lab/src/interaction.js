(function (root) {
  "use strict";

  var I = root.LaserLabInteraction = root.LaserLabInteraction || {};

  I.bindBenchInteractions = function (svg, actions) {
    var active = null;
    function toWorld(event) {
      var point = svg.createSVGPoint();
      point.x = event.clientX; point.y = event.clientY;
      var matrix = svg.getScreenCTM();
      if (!matrix) return { x: 0, y: 0 };
      var world = point.matrixTransform(matrix.inverse());
      return { x: world.x, y: world.y };
    }
    function selectedIdFromTarget(target) {
      var group = target.closest ? target.closest("[data-element-id]") : null;
      return group ? group.getAttribute("data-element-id") : null;
    }

    function onPointerDown(event) {
      var id = selectedIdFromTarget(event.target);
      if (!id) return;
      var position = toWorld(event);
      active = { id: id, position: position };
      actions.select(id);
      svg.setPointerCapture(event.pointerId);
      event.preventDefault();
    }
    function onPointerMove(event) {
      if (!active) return;
      var position = toWorld(event);
      actions.move(active.id, { x: position.x - active.position.x, y: position.y - active.position.y });
      active.position = position;
      event.preventDefault();
    }
    function onPointerUp(event) {
      if (!active) return;
      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
      if (actions.commit) actions.commit(active.id);
      active = null;
    }
    function onKeyDown(event) {
      var id = actions.getSelectedId();
      if (!id) return;
      var amount = event.shiftKey ? 10 : 2;
      var delta = { x: 0, y: 0 };
      if (event.key === "ArrowLeft") delta.x = -amount;
      if (event.key === "ArrowRight") delta.x = amount;
      if (event.key === "ArrowUp") delta.y = -amount;
      if (event.key === "ArrowDown") delta.y = amount;
      if (delta.x || delta.y) { actions.move(id, delta); event.preventDefault(); }
      if (event.key.toLowerCase() === "q") { actions.rotate(id, -Math.PI / 36); event.preventDefault(); }
      if (event.key.toLowerCase() === "e") { actions.rotate(id, Math.PI / 36); event.preventDefault(); }
      if (event.key === "Delete" || event.key === "Backspace") { actions.remove(id); event.preventDefault(); }
    }

    svg.addEventListener("pointerdown", onPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    svg.addEventListener("pointerup", onPointerUp);
    svg.addEventListener("pointercancel", onPointerUp);
    svg.addEventListener("keydown", onKeyDown);
    return function cleanup() {
      svg.removeEventListener("pointerdown", onPointerDown);
      svg.removeEventListener("pointermove", onPointerMove);
      svg.removeEventListener("pointerup", onPointerUp);
      svg.removeEventListener("pointercancel", onPointerUp);
      svg.removeEventListener("keydown", onKeyDown);
    };
  };
})(window);
