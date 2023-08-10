import React from "react"
import AfgTopicSection from './afg-topic-section'
import {render} from '@testing-library/react';

describe("Topic Section Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(

        <AfgTopicSection
          heading='The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as deficit spending.'
          body='A budget deficit occurs when the money spent exceeds the money collected for a given period.'
          linkUrl='/national-deficit'
          linkText='Learn more about national deficit'
          linkColor='#B3532D'
          image='/topics-section-images/homepage_deficit_1200x630.png'
          imageAltText=''
        />

    )
    expect(getByTestId("topic-section")).toBeInTheDocument();
  })
})
