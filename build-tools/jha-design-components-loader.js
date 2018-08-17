const PolymerRegex = /()(class (.*) extends )(Polymer\.Element)/;
module.exports = content => {
  if (Boolean(content.search(PolymerRegex))) {
    return content.replace(
      PolymerRegex,
      `import { Element as PolymerElement } from '@banno/polymer/polymer-element.js';\n$1$2PolymerElement`
    );
  }
  return content;
};
