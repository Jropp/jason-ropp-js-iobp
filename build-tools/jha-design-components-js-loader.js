const PolymerDot = /window\..*=\sclass\sextends\sPolymer\.Element/;
const classFormatRegex = /\=\sclass\sextends\sPolymer.Element\s\{/;
const classFormatFix = `= class extends PolymerElement {`;
const importPolymer =
  'import { Element as PolymerElement } from "@banno/polymer/polymer-element.js"';

module.exports = content => {
  if (content.match(PolymerDot)) {
    let fixedClassDeclaration = content.replace(
      classFormatRegex,
      `${classFormatFix}`
    );

    let importAdded = `${importPolymer}\n${fixedClassDeclaration};`;

    return importAdded;
  }

  return content;
};
