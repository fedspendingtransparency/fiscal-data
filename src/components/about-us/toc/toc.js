export const paramsErrorMsg = `tocBuilder - Incorrect params passed into function`;
export const classLevelErrorMsg = `tocBuilder - Not enough classes in classLevelArr`
/**
 * For content that is created using mdx markup where the content is built out as seen below, this works to parse
 * the mdxAST to determine the sections in the toc and what level heading is used for the section.
 * Please note, the pattern starts with a jsx <section> component, followed by a heading,
 * followed by the section's content, followed by the close </section> tag.
 *
 * <section id='someId'>
 *
 * ## Some heading
 *
 * ... Content Here...
 *
 * </section>
 *
 * @param mdxAST - Array of mdxAST toc data
 * @param classLevelArr - An array of class names where the index is equal to the heading level (depth) - 1.
 * It will likely look like this: [heading1,heading2,heading3]
 * @returns {[]} - Returns an array of section information to feed into secondary-nav.tsx
 */
export const tocBuilder = (mdxAST, classLevelArr) => {
  if (!mdxAST || !classLevelArr || classLevelArr.length === 0) {
    console.error(paramsErrorMsg);
    return [];
  }
  const astLen = mdxAST.length;
  const curSection = {
    id: '',
    className: '',
    headingLevel: '',
    title: ''
  };
  const tocArr = [];
  let isBuildingLink = false;

  for (let i = 0; i < astLen; i++) {
    const node = mdxAST[i];
    const type = node.type;
    if (type === 'jsx') {
      let value = node.value;
      if (value.substr(0,8) === '<section') {
        value = value.split("'");
        curSection.id = value.length > 1 ? value[1] : '';
        isBuildingLink = true;
      }
    } else if (type === 'heading' && isBuildingLink) {
      curSection.headingLevel = node.depth;
      if (classLevelArr.length < node.depth) {
        console.error(classLevelErrorMsg);
        return [];
      }
      curSection.className = classLevelArr[node.depth - 1];
      if (node.children.length) {
        curSection.title = node.children[0].value;
      }
      tocArr.push(JSON.parse(JSON.stringify(curSection)));
      isBuildingLink = false;
    }
  }

  return tocArr;
}
