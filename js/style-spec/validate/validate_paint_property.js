'use strict';

const validate = require('./validate');
const ValidationError = require('../error/validation_error');

module.exports = function validatePaintProperty(options) {
    const key = options.key;
    const style = options.style;
    const styleSpec = options.styleSpec;
    const value = options.value;
    const propertyKey = options.objectKey;
    const layerSpec = styleSpec[`paint_${options.layerType}`];

    if (!layerSpec) return [];

    const transitionMatch = propertyKey.match(/^(.*)-transition$/);

    if (transitionMatch && layerSpec[transitionMatch[1]] && layerSpec[transitionMatch[1]].transition) {
        return validate({
            key: key,
            value: value,
            valueSpec: styleSpec.transition,
            style: style,
            styleSpec: styleSpec
        });

    } else if (options.valueSpec || layerSpec[propertyKey]) {
        return validate({
            key: options.key,
            value: value,
            valueSpec: options.valueSpec || layerSpec[propertyKey],
            style: style,
            styleSpec: styleSpec
        });

    } else {
        return [new ValidationError(key, value, 'unknown property "%s"', propertyKey)];
    }

};
