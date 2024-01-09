import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible(!visible);
    const { buttonLabel, children } = props;
    const buttonStyle = {
        marginBlock: '0.5rem',
        marginInlineStart: '0.2rem',
    };
    useImperativeHandle(ref, () => {
        return { toggleVisibility };
    });
    return (
        <div>
            <div
                className={`togglable-header${visible ? ' hidden' : ''}`}
                style={buttonStyle}>
                <button
                    className='btn-show'
                    type='button'
                    onClick={toggleVisibility}>
                    {buttonLabel}
                </button>
            </div>
            <div className={`togglable-content${visible ? '' : ' hidden'}`}>
                {children}
                <button
                    className='btn-hide'
                    type='button'
                    style={buttonStyle}
                    onClick={toggleVisibility}>
                    Cancel
                </button>
            </div>
        </div>
    );
});
Togglable.displayName = 'Togglable';
Togglable.propTypes = { buttonLabel: PropTypes.string.isRequired };

export default Togglable;
