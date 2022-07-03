export function calcDistance(pos1, pos2) {
  const { latitude: lat1, longitude: lng1 } = pos1;

  const { latitude: lat2, longitude: lng2 } = pos2;

  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return NaN;
  }

  return Number(
    AMap.GeometryUtil.distance(
      [Number(lng1), Number(lat1)],
      [Number(lng2), Number(lat2)]
    ).toFixed(2)
  );
}
