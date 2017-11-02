const R = require('ramda');

const extractMappingAttributes = (mapping, input) => {
  const stringMappingKeys = R.keys(mapping);
  const values = stringMappingKeys.map(key => {
    const path = key.split('.');
    const lens = R.lensPath(path);
    return R.view(lens, input);
  });
  const keys = R.values(mapping);
  return { values, keys };
};

const generateObjectFromKeysAndValues = (keysValues) => R.zipObj(keysValues.keys, keysValues.values);

const stripObject = (object, attributes) => {
  let newObj = object;
  attributes.forEach(attribute => {
    const path = attribute.split('.');
    newObj = R.dissocPath(path, newObj);
  });
  return newObj;
};

const mergeObjects = (obj1, obj2) => R.merge(obj1, obj2);

const map = (mapping, input) => {
  const keysValues = extractMappingAttributes(mapping, input);
  const newObj = generateObjectFromKeysAndValues(keysValues);
  const strippedOriginalObject = stripObject(input, R.keys(mapping));
  return mergeObjects(newObj, strippedOriginalObject);
};

module.exports = map;