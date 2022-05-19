const univ3prices = require('@thanpolas/univ3prices');

const tick = 200235

const sqrtRatio = univ3prices.tickMath.getSqrtRatioAtTick(tick);

const price = univ3prices([6, 18], sqrtRatio).toAuto();

console.log(price);