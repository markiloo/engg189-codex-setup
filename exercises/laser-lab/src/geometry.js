(function (root) {
  "use strict";

  var G = root.LaserLabGeometry = root.LaserLabGeometry || {};
  var EPSILON = 1e-7;

  G.EPSILON = EPSILON;
  G.add = function (a, b) { return { x: a.x + b.x, y: a.y + b.y }; };
  G.subtract = function (a, b) { return { x: a.x - b.x, y: a.y - b.y }; };
  G.scale = function (v, n) { return { x: v.x * n, y: v.y * n }; };
  G.dot = function (a, b) { return a.x * b.x + a.y * b.y; };
  G.cross = function (a, b) { return a.x * b.y - a.y * b.x; };
  G.length = function (v) { return Math.hypot(v.x, v.y); };
  G.normalize = function (v) {
    var length = G.length(v);
    if (length < EPSILON) throw new Error("Cannot normalize a zero vector");
    return G.scale(v, 1 / length);
  };
  G.fromAngle = function (angleRad) { return { x: Math.cos(angleRad), y: Math.sin(angleRad) }; };
  G.pointAt = function (origin, direction, distance) { return G.add(origin, G.scale(direction, distance)); };
  G.distance = function (a, b) { return G.length(G.subtract(a, b)); };

  G.raySegmentIntersection = function (origin, direction, start, end, epsilon) {
    epsilon = epsilon == null ? EPSILON : epsilon;
    var segment = G.subtract(end, start);
    var denominator = G.cross(direction, segment);
    if (Math.abs(denominator) < epsilon) return null;
    var offset = G.subtract(start, origin);
    var distance = G.cross(offset, segment) / denominator;
    var fraction = G.cross(offset, direction) / denominator;
    if (distance < epsilon || fraction < -epsilon || fraction > 1 + epsilon) return null;
    return { point: G.pointAt(origin, direction, distance), distance: distance, fraction: fraction };
  };

  G.rayCircleIntersection = function (origin, direction, center, radius, epsilon) {
    epsilon = epsilon == null ? EPSILON : epsilon;
    var offset = G.subtract(origin, center);
    var b = 2 * G.dot(direction, offset);
    var c = G.dot(offset, offset) - radius * radius;
    var discriminant = b * b - 4 * c;
    if (discriminant < 0) return null;
    var root = Math.sqrt(discriminant);
    var t1 = (-b - root) / 2;
    var t2 = (-b + root) / 2;
    var distance = t1 >= epsilon ? t1 : (t2 >= epsilon ? t2 : null);
    if (distance == null) return null;
    var point = G.pointAt(origin, direction, distance);
    return { point: point, distance: distance, normal: G.normalize(G.subtract(point, center)) };
  };

  G.rayBoundsIntersection = function (origin, direction, bounds, epsilon) {
    var minX = bounds.minX, maxX = bounds.maxX, minY = bounds.minY, maxY = bounds.maxY;
    var edges = [
      [{ x: minX, y: minY }, { x: maxX, y: minY }],
      [{ x: maxX, y: minY }, { x: maxX, y: maxY }],
      [{ x: maxX, y: maxY }, { x: minX, y: maxY }],
      [{ x: minX, y: maxY }, { x: minX, y: minY }]
    ];
    var nearest = null;
    edges.forEach(function (edge) {
      var hit = G.raySegmentIntersection(origin, direction, edge[0], edge[1], epsilon);
      if (hit && (!nearest || hit.distance < nearest.distance)) nearest = hit;
    });
    return nearest;
  };

  G.reflect = function (direction, normal) {
    var d = G.normalize(direction);
    var n = G.normalize(normal);
    return G.normalize(G.subtract(d, G.scale(n, 2 * G.dot(d, n))));
  };
})(window);
