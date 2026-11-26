const path = require('path');

module.exports = {
  dependencies: {
    'nitro-core': {
      root: path.dirname(require.resolve('nitro-core')),
      platforms: { ios: null, android: null },
    },
  },
};
