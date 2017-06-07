const CalcDisplay = ({value, isError}) => {
	return (
		<div className='calc-display-container'>
			<div className='calc-display' >
				<span className='displayed-value'>{isError ? 'Error' : value}</span>
			</div>
		</div>
	);
};

export default CalcDisplay;