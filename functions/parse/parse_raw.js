const { unflatten } = require("flat");

const arrayDots = field => field.replace("[", ".").replace("]", "");

module.exports = ({ Fields: fields, Rows: rows } = {}) => (rows || [])
    .map(row => fields.reduce((st, field, i) => ({ ...st, [arrayDots(field)]: row[i] }), {}))
    .map(unflatten);
