# babel-plugin-one-import-more

import one name from multiple source libs;

just like import {Button,Slide} from '@components'; Button is from antd design react,Slide is from your custom component

![](https://img.shields.io/npm/v/babel-plugin-one-import-more.svg?style=flat)

## Installation

```
npm install babel-plugin-one-import-more -D
```

## use in webpack example 
use antd component and your own component in @components;

```

let antdMap = {
  DatePicker: "date-picker",
  AutoComplete: "auto-complete",
  TreeSelect: "tree-select",
  TimePicker: "time-picker"
};
let mapComponents=[
 'Custom1','Custom2'
]

       {
            test: /\.(js|jsx|mjs)$/,
            exclude:[....],
            loader: require.resolve("babel-loader"),
            options: {
              plugins: [
                [
                  'babel-plugin-one-import-more',
                  {
                    keyword: "@components",//custom root name
                    dispatch: function(componentName, componentsArr, keyword) {//componentName is your component name,just like Button
                      if (componentsArr.length > 0) {//@components/Button,not import {Button} from '@components';
                        componentName = componentsArr[0];
                      }
                      let name;
                      if (componentName in antdMap) {
                        name = antdMap[componentName];
                      } else {
                        name = componentName.toLowerCase();
                      }
                      if (mapComponents.indexOf(componentName) === -1) {//custom components
                        return {
                          js: { rely: `antd/lib/${name}`, name: componentName },//where render js path,and name
                          css: { rely: `antd/lib/${name}/style/css` }//which render css
                        };
                      } else {
                        let newUrl = componentName;
                        if (componentsArr.length > 0) {
                          newUrl = componentsArr.slice(0).join("/");
                        }
                        return {
                          js: {
                            rely: nodepath.join(config.componentUrl, newUrl),//where render js path
                            name: componentName//render name
                          }
                        };
                      }
                    }
                  }
                ]
              ],
              cacheDirectory: true
            }
          }


```

## use in app

```
import {Button} from '@components';
or
import Button from '@components/Button';
```