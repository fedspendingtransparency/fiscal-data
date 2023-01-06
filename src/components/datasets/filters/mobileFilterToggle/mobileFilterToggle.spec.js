import React from 'react'
import renderer from 'react-test-renderer'
import MobileFilterToggle from './mobileFilterToggle'
import * as styles from './mobileFilterToggle.module.scss'
jest.useFakeTimers()
describe('Mobile Filter Toggle', ()=> {
    let component=renderer.create()
    let instance 
    let mobileToggleSpy=null
    let mobileToggle
    let toggleButton
    const mobileToggleFn=jest.fn()
    const filterResetFn=jest.fn()


        renderer.act(()=> {
            component=renderer.create(<MobileFilterToggle filterCnt={3} datasetsView={true}
            toggleDatasetView={mobileToggleFn} datasetsCount={13} filterReset={filterResetFn}
            />)
        })

        instance=component.root
        mobileToggleSpy=jest.spyOn(instance.props, "toggleDatasetView")
        mobileToggle=instance.findByType(MobileFilterToggle)
        toggleButton=mobileToggle.findByProps({"className": "toggleButton"})
 

    it("renders element", ()=> {
        expect(mobileToggle).toBeDefined()
    })

    it('shows toggle button text as filter your results when viewing datasets', ()=> {
        expect(toggleButton.props.children).toBe("Filter Your Results")
    })

    it('toggles datasetView when toggle button is clicked', async ()=> {
        renderer.act(()=> {
            toggleButton.props.onClick(false)
        })

        jest.runAllTimers()
        expect(mobileToggleSpy).toHaveBeenCalled()
    })

    it('shows filter reset button when datasetViews are false and activeFilters.length >0', ()=> {
        
        renderer.act(()=> {
            component=renderer.create(<MobileFilterToggle filterCnt={3} datasetsView={false}
                toggleDatasetView={mobileToggleFn} datasetsCount={13} filterReset={filterResetFn}
                />)
        })
        instance=component.root
        const resetFiltersButton=instance.findByProps({"className": styles.resetButton})
        expect(resetFiltersButton).toBeDefined()
    })
})


