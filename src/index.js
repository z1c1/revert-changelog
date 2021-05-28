#!/usr/bin/env node

const fs = require('fs');

let [_1, _2, versionStr, filename] = process.argv;

const versionRegEx = /^[vV@#]?(\d+\.\d+\.\d+)$/;

if (versionStr) {
  if (versionRegEx.test(versionStr)) {
    versionStr = versionStr.match(versionRegEx)[1];
  } else if (!filename) {
    filename = versionStr;
    versionStr = '';
  } else {
    versionStr = '';
  }
}

if (!filename) {
  filename = 'CHANGELOG.md';
}

if (fs.existsSync(filename)) {
  const changelog = fs.readFileSync(filename, 'utf-8');
  const EOF = '## 0.0.0';
  const changelogForReg = changelog + EOF;

  const logBlockRegEx = /#+ \d+\.\d+\.\d+([\s\S\n]*?)(?=#+ \d+\.\d+\.\d+)/g;
  const logBlockVerRegEx = /(?<=#+ )\d+\.\d+\.\d+/;

  const logBlocks = changelogForReg.match(logBlockRegEx);

  if (logBlocks) {
    const logBlocksData = logBlocks.map((blockStr) => {
      const blockVer = blockStr.match(logBlockVerRegEx)[0];
      return { ver: blockVer, log: blockStr };
    });

    if (!versionStr) {
      versionStr = logBlocksData[0].ver;
    }

    const revertIndex = logBlocksData.findIndex(({ ver }) => ver === versionStr);
    if (revertIndex > -1) {
      const revertLogBlocks = logBlocks.slice(0, revertIndex + 1);
      const revertedChangelog = revertLogBlocks.length === logBlocks.length ? '' : changelog.replace(revertLogBlocks.join(''), '');
      fs.writeFileSync(filename, revertedChangelog);
    }
  }
}
