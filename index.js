const Analyzer = require('./src/analyzer.js');

window.setupAnalyzer = function(wrapperId) {
  return new Promise((resolve, reject) => {
    const analyzer = new Analyzer(wrapperId);
    analyzer.start().then(resolve).catch(reject);
  });
};