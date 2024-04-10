
function createLightningBypass() {
  let _filterKeys = [
    '$$HostElementKey$$',
    '$$ShadowedNodeKey$$'
  ];
  let _tmpSuffix = '_tmp';
  const mkTmp = s => s + tmpSuffix;

  const swapKeys = (el, oldKey, newKey) => {
    if (el.hasOwnProperty(oldKey)) {
      el[newKey] = el[oldKey];
      delete el[oldKey];
    }
  };
  const disableSingleKey = (el, ok) => swapKeys(el, ok, mkTmp(ok));
  const enableSingleKey = (el, ok) => swapKeys(el, mkTmp(ok), ok);

  const forAllKeys = (el, f) => { for (const ok of filterKeys) f(el, ok); };
  const disableAllKeys = el => forAllKeys(el, disableSingleKey);
  const enableAllKeys = el => forAllKeys(el, enableSingleKey);

  const forAllNodes = (f) => { for (const n of document.all) f(n); };
  const disableFilterAll = () => forAllNodes(disableAllKeys);
  const enableFilterAll = () => forAllNodes(enableAllKeys);

  const _bypass = (func) => {
    disableFilterAll();
    try {
      return func();
    } finally {
      enableFilterAll();
    }
  };

  return {
    filterKeys: _filterKeys,
    get propertyTempSuffix() { return _tmpSuffix; },
    set propertyTempSuffix(value) { _tmpSuffix = value; },
    bypass: _bypass,
  };
}
