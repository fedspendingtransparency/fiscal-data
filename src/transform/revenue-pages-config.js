const revenuePagesSource = {
  "americas-finance-guide": {
    slug: "/americas-finance-guide/",
    breadCrumbLinkName: "Debt",
    seoConfig: {
      pageTitle: "Understanding the National Debt",
      description: `Learn how the national debt works and how it impacts you.`,
    },
    prodReady: true,
    heroImage: {
      heading: "What is the national debt?",
      subHeading: `The national debt is the total amount of outstanding borrowing by the U.S. Federal
        Government accumulated over the nation’s history.`,
    },
  },
}

const freshRevenuePages = () => {
  const output = []

  Object.entries(revenuePagesSource).forEach(([pageName, ep]) => {
    output[output.length] = {
      ...ep,
      pageName,
    }
  })

  return output
}

exports.freshRevenuePages = freshRevenuePages
