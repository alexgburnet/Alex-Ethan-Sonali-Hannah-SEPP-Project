import './CustomButton.css';

function CustomButton( props ) {

    return (
        <button
            className ={props.className ? props.className :  'custom-button'}
            onClick={props.onClick}
            style={props.style}
        >
            {props.text ? props.text : 'add title attribute'}
        </button>
    )
}

export default CustomButton;