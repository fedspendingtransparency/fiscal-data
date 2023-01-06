import React from 'react'
import NotFoundGraphic from './notFoundGraphic'
import renderer from 'react-test-renderer'

describe('Not Found Graphic', ()=> {
    let instance
    let component =renderer.create()
    renderer.act(()=> {
        component=renderer.create(
            <NotFoundGraphic />
        )
    })
    instance=component.root

    it('renders an image', ()=> {
        expect(instance.findByType('img')).toBeDefined()
    })
})