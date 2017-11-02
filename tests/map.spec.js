const rewire = require('rewire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mappingConfig = require('./helpers/exampleConfig');
const exampleRfq = require('./helpers/examplePayload');

const should = chai.should();

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Map', () => {
  let sut;

  beforeEach(() => {
    sut = rewire('../main.js');
  });

  it('should exist', () => should.exist(sut));

  describe('#extractMappingAttributes', () => {
    let extractMappingAttributes;

    beforeEach(() => {
      extractMappingAttributes = sut.__get__('extractMappingAttributes');
    });

    it('should accept a mapping config object and an object to transform, and return a new object', () => {
      const result = extractMappingAttributes(mappingConfig, exampleRfq);
      (typeof result).should.eq('object');
    });

    it('returned object should contain an array of all the values from the object to be transformed associated with the keys in the config map', () => {
      const result = extractMappingAttributes(mappingConfig, exampleRfq);
      result.values.should.eql(["Male", "foo", "bar", "abc@def.com", "07629949037"]);
    });

    it('returned object should contain an array of all the values from the mapping object', () => {
      const result = extractMappingAttributes(mappingConfig, exampleRfq);
      result.keys.should.eql(["title", "firstName", "lastName", "email", "phone"]);
    });
  });

  describe('#extractMappingAttributes', () => {
    let generateObjectFromKeysAndValues;

    beforeEach(() => {
      generateObjectFromKeysAndValues = sut.__get__('generateObjectFromKeysAndValues');
    });

    it('should return an object based on keys and values provided', () => {
      const keysValues = {
        keys: ['a', 'b'], values: [1, 2]
      };
      const result = generateObjectFromKeysAndValues(keysValues);
      result.should.eql({ a: 1, b: 2 });
    });
  });

  describe('#stripObject', () => {
    let scrubObject;

    beforeEach(() => {
      scrubObject = sut.__get__('stripObject');
    });

    it('should take an object and a series of attributes and return a new object scrubbed of all the supplied attributes', () => {
      const result = scrubObject(exampleRfq, ["individual.email", "individual.info.firstName"]);
      result.should.eql({
        "individual": {
          "mobileNumber": "07629949037",
          "info": {
            "lastName": "bar",
            "gender": "Male",
            "dob": 708520437489,
            "relationshipStatus": "Separated",
            "job": "Nurse",
            "employment": "Employed",
            "industry": "health",
            "otherWork": false
          }
        }
      });
    });
  });

  describe('Map', () => {
    it('should remap attributes of an object based on config json', () => {
      const map = sut;
      const mappedObject = map(mappingConfig, exampleRfq);
      mappedObject.should.eql({
        title: 'Male',
        firstName: 'foo',
        lastName: 'bar',
        email: 'abc@def.com',
        phone: '07629949037',
        individual: {
          info: {
            "dob": 708520437489,
            "relationshipStatus": "Separated",
            "job": "Nurse",
            "employment": "Employed",
            "industry": "health",
            "otherWork": false
          }
        }
      });
    });
  });
});
