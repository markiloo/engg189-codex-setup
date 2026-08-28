(function (root) {
  "use strict";

  var T = root.LaserLabTrace = root.LaserLabTrace || {};
  var G = root.LaserLabGeometry;

  function endpoints(mirror) {
    var tangent = G.fromAngle(mirror.angleRad);
    var half = mirror.length / 2;
    return { start: G.subtract(mirror.center, G.scale(tangent, half)), end: G.add(mirror.center, G.scale(tangent, half)) };
  }

  function mirrorNormal(mirror) {
    var tangent = G.fromAngle(mirror.angleRad);
    return G.normalize({ x: -tangent.y, y: tangent.x });
  }

  function lensEndpoints(lens) {
    var tangent = G.fromAngle(lens.angleRad + Math.PI / 2);
    var half = lens.length / 2;
    return { start: G.subtract(lens.center, G.scale(tangent, half)), end: G.add(lens.center, G.scale(tangent, half)) };
  }

  function lensDirection(lens, point, incomingDirection) {
    var opticalAxis = G.fromAngle(lens.angleRad);
    var outgoingAxis = G.dot(incomingDirection, opticalAxis) >= 0 ? opticalAxis : G.scale(opticalAxis, -1);
    var focalPoint = G.add(lens.center, G.scale(outgoingAxis, lens.focalLength));
    return G.normalize(G.subtract(focalPoint, point));
  }

  T.mirrorEndpoints = endpoints;
  T.lensEndpoints = lensEndpoints;
  T.lensDirection = lensDirection;
  T.traceScene = function (scene, options) {
    options = options || {};
    var maxBounces = options.maxBounces == null ? 8 : options.maxBounces;
    var epsilon = options.epsilon == null ? 0.001 : options.epsilon;
    var segments = [];
    var hits = [];
    var lasers = scene.elements.filter(function (element) { return element.kind === "laser" && element.enabled !== false; });
    var mirrors = scene.elements.filter(function (element) { return element.kind === "mirror"; });
    var lenses = scene.elements.filter(function (element) { return element.kind === "lens"; });
    var targets = scene.elements.filter(function (element) { return element.kind === "target"; });

    lasers.forEach(function (laser) {
      var origin = { x: laser.position.x, y: laser.position.y };
      var direction = G.fromAngle(laser.angleRad);
      for (var bounce = 0; bounce <= maxBounces; bounce += 1) {
        var boundary = G.rayBoundsIntersection(origin, direction, scene.bounds, epsilon);
        if (!boundary) break;
        var nearest = { kind: "boundary", distance: boundary.distance, point: boundary.point };

        mirrors.forEach(function (mirror) {
          var ends = endpoints(mirror);
          var hit = G.raySegmentIntersection(origin, direction, ends.start, ends.end, epsilon);
          if (hit && hit.distance < nearest.distance) nearest = { kind: "mirror", id: mirror.id, distance: hit.distance, point: hit.point, normal: mirrorNormal(mirror) };
        });

        lenses.forEach(function (lens) {
          var ends = lensEndpoints(lens);
          var hit = G.raySegmentIntersection(origin, direction, ends.start, ends.end, epsilon);
          if (hit && hit.distance < nearest.distance) nearest = { kind: "lens", id: lens.id, distance: hit.distance, point: hit.point };
        });

        targets.forEach(function (target) {
          var hit = G.rayCircleIntersection(origin, direction, target.center, target.radius, epsilon);
          if (hit && hit.distance < nearest.distance) nearest = { kind: "target", id: target.id, distance: hit.distance, point: hit.point, normal: hit.normal };
        });

        segments.push({ from: { x: origin.x, y: origin.y }, to: { x: nearest.point.x, y: nearest.point.y }, wavelengthNm: laser.wavelengthNm, intensity: laser.intensity, terminatedBy: nearest.kind, elementId: nearest.id || null });
        if (nearest.kind === "target") {
          hits.push({ laserId: laser.id, targetId: nearest.id, point: nearest.point });
          break;
        }
        if (nearest.kind === "boundary") break;
        if (nearest.kind === "mirror") direction = G.reflect(direction, nearest.normal);
        if (nearest.kind === "lens") direction = lensDirection(lenses.filter(function (lens) { return lens.id === nearest.id; })[0], nearest.point, direction);
        origin = G.pointAt(nearest.point, direction, epsilon * 10);
      }
    });

    return { segments: segments, hits: hits, rayCount: segments.length, targetHitCount: hits.length };
  };
})(window);
