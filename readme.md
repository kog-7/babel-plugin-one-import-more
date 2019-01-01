# babel-plugin-one-import-more

import components from multiple source libs in one scope name

just like import {Button,Slide} from '@components'; Button is from react antd design,Slide is from your custom component

![](https://img.shields.io/npm/v/babel-plugin-one-import-more.svg?style=flat)

## Installation

```
npm install babel-plugin-one-import-more -D
```

## option

#### custom scope name

keyword: "@components" //define own name

#### custom path include js/css

```
interface Js{
  rely:string,//path,like antd/lib/button or /.../components/button
  name:string //componentName
}
interface Css{
  rely:string
}


dispatch:function(componentName:string, componentsArr:string[]):{js:Js,css?:Css} //compentName Button where use import Button,componentsArr just like ['Button'] in from '@components/Button'

```


##  example 
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
                    dispatch: function(componentName, componentsArr) {//componentName is your component name,just like Button
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
                        return {//if in js use wrap:true,will parse {} from lib 
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