import renderer from 'react-test-renderer';

export const renderHelper = (c) => {
    let component = renderer.create();

    renderer.act(() => {
        component = renderer.create(c);
    });
    const instance = component.root;

    return { component, instance, renderer };
}