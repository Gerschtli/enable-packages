'use babel';

import EnablePackages from '../lib/enable-packages';

describe('EnablePackages', () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage('enable-packages');
  });
});
