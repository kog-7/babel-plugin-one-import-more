let types = require("babel-types");
let nodepath = require("path");
// let helps = require("babel-helper-module-imports");
// import {
//   addSideEffect,

// } from "babel-helper-module-imports";

let utils = {
  firstLower(str) {
    return str[0].toLowerCase() + str.slice(1);
  },
  joinUrl(url, ...paths) {
    if (url) {
      url = url.slice(-1) === "/" ? url.slice(0, -1) : url;
    }
    let out = url;
    paths.forEach(ph => {
      ph = ph[0] === "/" ? ph.slice(1) : ph;
      out += ph;
    });
    return out;
  }
};

let handleDefaultImport = path => {
  return path.node.specifiers.filter(function(specifier) {
    return specifier.type !== "ImportSpecifier";
  });
};
let handleImport = path => {
  return path.node.specifiers.filter(function(specifier) {
    return specifier.type === "ImportSpecifier";
  });
};

let checkScope = (relyUrl, keyword) => {
  if (relyUrl === keyword || relyUrl.indexOf(`${keyword}/`) === 0) {
    return true;
  }
  return false;
};

let antdMap = {};

// let dispatchRes = (componentName, components, keyword) => {
//   let name = componentName.toLowerCase();
//   if (componentName in components) {
//     return { js: { rely: `${keyword}/${componentName}`, name: componentName } };
//   } else {
//     return {
//       js: { rely: `antd/lib/${name}`, name: componentName },
//       css: { rely: `antd/lib/${name}/style/css` }
//     };
//   }
// };

module.exports = function() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        let relyUrl = path.node.source.value;
        let opts = state.opts;
        let keyword = opts.keyword || "@components";
  
        // let components = opts.components || {};
        let dispatchRes = opts.dispatch;
        // console.log(checkScope(relyUrl, keyword), relyUrl);

        if (checkScope(relyUrl, keyword) === false || !dispatchRes) {
          return;
        }

        let relyArr= relyUrl.split("/").filter((val, ind) => {
                        if (val) {
                          return true;
                        }
                        return false;
                      });

        let componentsArr=relyArr.slice(1);   
        let imports = handleImport(path);
        let defaultImports = handleDefaultImport(path);
        let transforms = [];

        defaultImports.forEach((importObj, ind) => {
          let componentName = importObj.local.name;
          let newRelyObj = dispatchRes(componentName, componentsArr, keyword);
          let { css, js } = newRelyObj;

         

          transforms.push(
            types.importDeclaration([importObj], types.stringLiteral(js.rely))
          );
          if (typeof css === "object") {
            // let newImportObj = types.importDefaultSpecifier(
            //   types.identifier("")
            // );
            // helps.addSideEffect(path, css.rely);
            transforms.push(
              types.importDeclaration([], types.stringLiteral(css.rely))
            );
          }
        });

        imports.forEach((importObj, ind) => {
          let componentName = importObj.imported.name;
          let localComponentName = importObj.local.name;
          let newRelyObj = dispatchRes(componentName, componentsArr, keyword);
          let { css, js } = newRelyObj;
          let newImportObj = importObj;
        
          if (relyArr.length === 1&&(js.wrap!==true)) {
            //for @comp.../Button,will  not change import source
            //not double layer
            newImportObj = types.importDefaultSpecifier(
              types.identifier(localComponentName)
            );
          }
          if(js.wrap===true){
            newImportObj.imported.name=js.name;
            newImportObj.local.name=localComponentName;
          }

          transforms.push(
            types.importDeclaration(
              [newImportObj],
              types.stringLiteral(js.rely)
            )
          );

          if (typeof css === "object") {
            // let newImportObj = types.importDefaultSpecifier(
            //   types.identifier("")
            // );
            // helps.addSideEffect(path, css.rely);
            transforms.push(
              types.importDeclaration([], types.stringLiteral(css.rely))
            );
          }
        });

        if (transforms.length > 0) {
          path.replaceWithMultiple(transforms);
        }
      }
    }
  };
};
