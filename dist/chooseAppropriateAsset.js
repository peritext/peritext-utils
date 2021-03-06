"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chooseAppropriateAsset;
exports.chooseAppropriateSubAsset = void 0;

/**
 * @param {object} resource
 * @param {array} rule - set of resource data to check
 * @param {object} assets - map of assets
 */
function chooseAppropriateAsset(resource, rule = [], assets = {}) {
  let i = 0;

  while (i < rule.length) {
    const candidate = rule[i];

    if (candidate.indexOf('AssetId') === -1) {
      return {
        resourceDataField: candidate,
        asset: null
      };
    } else if (resource.data[candidate] && assets[resource.data[candidate]]) {
      return {
        resourceDataField: candidate,
        asset: assets[resource.data[candidate]]
      };
    }
    /*else if (resource.data[candidate]) {
    return {
      resourceDataField: candidate
    }
    }*/


    i++;
  }

  return undefined;
}

const chooseAppropriateSubAsset = (sub, rule = [], assets) => {
  let i = 0;

  while (i < rule.length) {
    const candidate = rule[i];

    if (sub[candidate] && assets[sub[candidate]]) {
      return {
        resourceDataField: candidate,
        asset: assets[sub[candidate]]
      };
    }

    i++;
  }

  return undefined;
};

exports.chooseAppropriateSubAsset = chooseAppropriateSubAsset;