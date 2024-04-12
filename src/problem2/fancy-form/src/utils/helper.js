export const naiveRound = (num, decimalPlaces = 0) => {
    var p = Math.pow(10, decimalPlaces);
    return Math.round(num * p) / p;
}