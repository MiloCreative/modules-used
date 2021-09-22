function modulesUsed() {
  var cwd = process.cwd();
  var log = require('debug')('used');

  var join = require('path').join;
  var pkg = require(join(cwd, 'package.json'));
  log('modules used in', pkg.name);

  var read = require('fs').readFileSync;

  function getProdDependenciesList(pkg) {
    return pkg && pkg.dependencies ? Object.keys(pkg.dependencies) : [];
  }

  function dependencyDescription(name) {
    var filename = join(cwd, 'node_modules', name, 'package.json');
    var pkg = JSON.parse(read(filename));
    if (pkg.name === 'react-native') {
      //console.log(pkg)
      console.log("RN",homepageOrRepositoryUrl(pkg))
    }
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      homepage: pkg.homepage,
      repository: pkg.repository
    };
  }

  function hasHomepageOrRepositoryUrl(info) {
    return homepageOrRepositoryUrl(info) !== undefined;
  }

  function mdWithHomepage(info) {
    return '* [' + info.name + ' ' + info.version + '](' + homepageOrRepositoryUrl(info) + ') - ' + info.description;
  }

  function mdWithoutHomepage(info) {
    return '* ' + info.name + ' ' + info.version + ' - ' + info.description;
  }

  function homepageOrRepositoryUrl(info) {
    if (typeof info.homepage === 'string' && info.homepage !== undefined) {
      return info.homepage;
    } else if (info?.repository?.url !== undefined) {
      return info.repository.url.replace('git@github.com:','https://github.com/');
    } else {
      return undefined;
    }
  }

  function toMarkdown(info) {
    if (hasHomepageOrRepositoryUrl(info)) {
      return mdWithHomepage(info);
    } else {
      return mdWithoutHomepage(info);
    }
  }

  var prodDependencies = getProdDependenciesList(pkg);
  var described = prodDependencies.map(dependencyDescription);
  var markdown = described.map(toMarkdown).join('\n');
  log(markdown);
  return markdown;
}

module.exports = modulesUsed;

if (!module.parent) {
  console.log('modules used for this project');
  console.log(modulesUsed());
}
