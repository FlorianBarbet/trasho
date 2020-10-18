module.exports = {
    roundDecimal(nombre, precision) {
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round( nombre*tmp )/tmp;
    }
}