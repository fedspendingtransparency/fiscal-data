/* eslint-disable */
/* istanbul ignore file */
import React, { useState } from 'react';
import { useEffect } from 'react';

export default function DimensionControl(props) {
    const dimensions = props.dimensionOptions;
    const [active, setActive] = useState(false);
    const [key, setKey] = useState(dimensions.keys[0]);
    const [value, setValue] = useState(dimensions.values[0]);

    useEffect(() => {
        const payload = {};

        if (active) {
            payload.key = key;
            payload.value = value;
        }

        props.changeHandler(payload)
    }, [active, key, value])

    const handleControlChange = (id, event) => {
        if (id === 'key') {
            setKey(event.target.value)
        } else if (id === 'value') {
            setValue(event.target.value)
        } else {
            setActive(!active);
        }
    }

    return (
        <div>
            <label>Enable
                <input type="checkbox"
                    onChange={handleControlChange}
                    checked={active} />
            </label>
            <label>
                &nbsp;&nbsp;&nbsp;Category&nbsp;
                <select
                    defaultValue={key}
                    onChange={(e) => handleControlChange('key', e)}>
                    {dimensions.keys.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
            </label>&nbsp;
            <label>
                &nbsp;&nbsp;&nbsp;Value&nbsp;
                <select
                    defaultValue={value}
                    onChange={(e) => handleControlChange('value', e)}>
                    {dimensions.values.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </label>
        </div>
    );
}
