export const properMDX = [
  {
    type: `jsx`,
    value: `<section id='about-section'>`,
    id: 'about-section' // Not seen in the mdx, just used for testing
  },
  {
    type: `heading`,
    depth: 2,
    children: [{
      value: `About Fiscal Data`
    }]
  },
  {
    type: `jsx`,
    value: `</section>`
  },{
    type: `jsx`,
    value: `<section id='final-section'>`,
    id: 'final-section'  // Not seen in the mdx, just used for testing
  },
  {
    type: `heading`,
    depth: 3,
    children: [{
      value: `Finale`
    }]
  },
  {
    type: `jsx`,
    value: `</section>`
  },
];

export const mdxMultiHeaders = [
  {
    type: `jsx`,
    value: `<section id='about-section'>`,
    id: 'about-section' // Not seen in the mdx, just used for testing
  },
  {
    type: `heading`,
    depth: 2,
    children: [{
      value: `About Fiscal Data`
    }]
  },
  {
    type: `heading`,
    depth: 3,
    children: [{
      value: `Only the first heading makes it into the toc`
    }]
  },
  {
    type: `heading`,
    depth: 2,
    children: [{
      value: `This heading will also be ignored by the toc`
    }]
  },
  {
    type: `jsx`,
    value: `</section>`
  },{
    type: `jsx`,
    value: `<section id='final-section'>`,
    id: 'final-section'  // Not seen in the mdx, just used for testing
  },
  {
    type: `heading`,
    depth: 3,
    children: [{
      value: `Finale`
    }]
  },
  {
    type: `heading`,
    depth: 2,
    children: [{
      value: `This heading is ignore by the toc`
    }]
  },
  {
    type: `jsx`,
    value: `</section>`
  },
];

export const properMDXClassNames = ['header1', 'header2', 'header3'];

export const properMDXResult = [{
  id: properMDX[0].id, // Section id
  headingLevel: properMDX[1].depth, // 2
  className: properMDXClassNames[1], // Heading level 2: header2,
  title: properMDX[1].children[0].value
},
{
  id: properMDX[3].id, // Section id
  headingLevel: properMDX[4].depth, // 3
  className: properMDXClassNames[2], // Heading level 3: header3,
  title: properMDX[4].children[0].value
}];
