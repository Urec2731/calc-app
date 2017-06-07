import { isNull } from 'lodash';

const  ExchangeDisplay = ({exchangeRates}) => {
	if (isNull(exchangeRates)) {
		return <div/>;
	}
	
	const {buy, sale, base_ccy} = exchangeRates;
	return (
		<div className='exchange-display-container'>
			<div className='exchange-display' >
				<span className='displayed-value'>Курс доллара: 
				покупка {buy} {base_ccy}, продажа {sale} {base_ccy}.</span>
			</div>
		</div>
	);
};

export default ExchangeDisplay;