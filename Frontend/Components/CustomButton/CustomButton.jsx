import React from 'react';
import './CustomButton.css';

/**
 * CustomButton Component
 * 
 * A reusable button component that supports custom styling and event handling.
 * 
 * Props:
 * @param {object} props - Component properties
 * @param {string} props.text - The text to display on the button
 * @param {function} props.onClick - The function to call when the button is clicked
 * @param {string} [props.className] - Optional custom class name for styling
 * @param {object} [props.style] - Inline styles for the button
 * @param {boolean} [props.disabled] - whether the button is disabled
 * 
 * @returns {JSX.Element} - The rendered button element
 */

function CustomButton( props ) {

    return (
        <button
            className ={props.className ? props.className :  'custom-button'}
            onClick={props.onClick}
            style={{
                ...props.style,
                backgroundColor: props.disabled ? 'grey' : undefined,
                cursor: props.disabled ? 'not-allowed' : 'pointer',
            }}
            disabled={props.disabled}
        >
            {props.text ? props.text : 'add title attribute'}
        </button>
    )
}

export default CustomButton;