import classNames from 'classnames';

const CalcButton = ({title, clickHandler, isDisabled, isActive}) => {
	const classes = classNames('calc-button', {active: isActive});
	
	return (
		<div className='calc-button-container'>
			<button
				className={classes}
				onClick={()=>{clickHandler(title)}}
				disabled={isDisabled}
			>{title}</button>
		</div>
	);
};

export default CalcButton;