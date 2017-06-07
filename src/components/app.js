import { Component } from 'react';
import { find } from 'lodash';
import CalcButton from './calc-button';
import CalcDisplay from './calc-display';
import ExchangeDisplay from './exchange-display';
import { isDisabled } from '../utils/disabled-buttons';
import { isActive } from '../utils/active-buttons';
import { calcController } from '../utils/calc-controller';
import { apiUrl } from '../utils/api-url';
import {
	START_VALUE,
	numericKeys,
	operationsKeys,
	scientificKeys
} from '../utils/constants';

const initialState = {
	exchangeRates: null,
	memory: null,
	isError: false,
	touched: false,
	fromMemory: false,
	justCalculated: false,
	radians: false,
	operation: '',
	prevValue: '', 
	currentValue: START_VALUE
};


class App extends Component {
	constructor (props) {
		super(props);
		this.state = initialState;
		
		this.clickHandler = this.clickHandler.bind(this);
	}
	
	componentDidMount() {
		fetch(apiUrl)
			.then(response => {
				if (response.status !== 200) {
					throw 'Error while fetching data from API'
				}
				return response.json();
			})
			.then(data => {
				const exchangeRates = find(data, {ccy: 'USD'}) || null;
				this.setState({ exchangeRates });
			})
			.catch(console.log);
	}
	
	clickHandler (x) {
		calcController(x, this);
	}
	
	isDisabled (btnTitle) {
		const {memory:memoryValue, isError} = this.state;
		
		return isDisabled({btnTitle, memoryValue, isError});
	}
	
	isActive (btnTitle) {
		
		return isActive({btnTitle, radians: this.state.radians});
	}
	
	renderButtons (values) {
		return values.map((value, position) => {
			return (
				<CalcButton
					key={position}
					title={value}
					clickHandler={this.clickHandler}
					isDisabled={this.isDisabled(value)}
					isActive={this.isActive(value)}
				/>
			);
		});
	}
	
	render() {
		return (
			<div className='app-container'>
				<div className='main-area'>
					<ExchangeDisplay
						exchangeRates={this.state.exchangeRates}
					/>
					<CalcDisplay
						value={this.state.currentValue}
						isError={this.state.isError}
					/>
					<div className='scientific-key-pad'>
						{this.renderButtons(scientificKeys)}
					</div>
					<div className='numeric-key-pad'>
						{this.renderButtons(numericKeys)}
					</div>
					<div className='operations-key-pad'>
						{this.renderButtons(operationsKeys)}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
