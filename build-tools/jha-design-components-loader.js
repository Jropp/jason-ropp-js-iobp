const PolymerRegex = /()(class (.*) extends )(Polymer\.Element)/;
const designComponentJsPattern = /window\..*=\sclass\sextends\sPolymer\.Element/;
const jsPatterSectionToReplace = /\=\sclass\sextends\sPolymer\.Element\s\{/;
const jsSectionFix = `= class extends PolymerElement {`;
const polymerImport =
  'import { Element as PolymerElement } from "@banno/polymer/polymer-element.js"';

module.exports = content => {
  if (Boolean(content.match(designComponentJsPattern))) {
    let fixedClassDeclaration = content.replace(
      jsPatterSectionToReplace,
      jsSectionFix
    );

    let importAdded = `${polymerImport}\n${fixedClassDeclaration};`;

    content = importAdded;
  }

  if (Boolean(content.search(PolymerRegex))) {
    return content.replace(
      PolymerRegex,
      `import { Element as PolymerElement } from '@banno/polymer/polymer-element.js';\n$1$2PolymerElement`
    );
  }
  return content;
};
