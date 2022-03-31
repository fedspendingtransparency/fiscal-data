import React from 'react'
import renderer from 'react-test-renderer'
import notFoundGraphic from './notFoundGraphic';
import NotFoundText from './notFoundText'

describe("404 Not Found Text", ()=> {
    let instance;
    let component=renderer.create()
    renderer.act(()=> {
        component=renderer.create(
            <NotFoundText/>
        )
    })
    instance=component.root

    it("includes an h1 header", ()=> {
        const header=instance.findByType('h1')
        expect(header).toBeDefined()
      expect(header.props.className).toBe("notFoundHeader")
    })

    it("includes 404 header", ()=> {
        const h2=instance.findByType('h2')
        expect(h2).toBeDefined()
        expect(h2.props.children.props.children).toBe("404: Page not found")
    })

    it("includes a list with 3 links", ()=> {
        const ul=instance.findByType('ul')
        expect(ul.children.length).toBe(3)
    })

    it("includes the not found graphic", ()=> {
        const graphic=instance.findByType(notFoundGraphic)
        expect(graphic).toBeDefined()
    })
})