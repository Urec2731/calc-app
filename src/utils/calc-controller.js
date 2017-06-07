import { isNull, isNumber, dropRight } from 'lodash';
import {
	START_VALUE, CLEAR, DIVIDE, MULTIPLE, MINUS, PLUS,
	MC, MR, M_PLUS, NUM0, DOT, EQUALS, NUMBER_OF_DIGITS,
	RAD, DEG, BACKSPACE, LOG, SIN, LN, PI, COS, SQRT, E,
	TAN, X_POW_Y, X_2, X_3, INV
} from './constants';



const mathConstants = [PI, E];
const binaryOperations = [DIVIDE, MULTIPLE, MINUS, PLUS, X_POW_Y];
const unaryOperations = [LOG, SIN, LN, COS, SQRT, TAN, X_2, X_3];

const calculateUnary = (currentValue, action, radians) => {
	let result;
	
	try {
		const x = parseFloat(currentValue);
		switch (action) {
			case LOG:
				result = Math.log10(x);
				break;
			case LN:
				result = Math.log(x);
				break;
			case SQRT:
				result = Math.sqrt(x);
				break;
			case X_2:
				result = x ** 2;
				break;
			case X_3:
				result = x ** 3;
				break;
			case SIN:
				result = radians ? Math.sin(x) : Math.sin(x * Math.PI / 180);
				break;
			case COS:
				result = radians ? Math.cos(x) : Math.cos(x * Math.PI / 180);
				break;
			case TAN:
				result = radians ? Math.tan(x) : Math.tan(x * Math.PI / 180);
				break;
			default: throw 'Calc-controller: Uncnown unary Operation';
		}
		return {error: false, result: result.toString()};
	} catch (err) {
		console.log(err);
		return {error: true};
	}
	
};

const calculateBinary = (prevValue, currentValue, operation) => {
	let result;
	
	try {
		const a = parseFloat(prevValue), b = parseFloat(currentValue);
		switch (operation) {
			case DIVIDE:
				result = a / b;
				break;
			case MULTIPLE:
				result = a * b;
				break;
			case MINUS:
				result = a - b;
				break;
			case PLUS:
				result = a + b;
				break;
			case X_POW_Y:
				result = a ** b;
				break;
			default: throw 'Calc-controller: Uncnown Operation';
		}
		return {error: false, result: result.toString()};
	} catch (err) {
		console.log(err);
		return {error: true};
	}
	
};


export const calcController = (action, _this) => {
	const {
		memory,
		isError,
		touched,
		fromMemory,
		justCalculated,
		radians,
		operation,
		prevValue,
		currentValue
	} = _this.state;
	
	if (isError && action !== CLEAR) {
		return false;
	}
	if (action === CLEAR) {
		_this.setState({
			isError: false,
			touched: false,
			fromMemory: false,
			justCalculated: false,
			operation: '',
			prevValue: '',
			currentValue: START_VALUE
		});
		return true;
	}
	if (isNumber(action) || action === DOT) {
		if (justCalculated) {
			_this.setState({
				currentValue: String().concat(
					action !== DOT ? '' : START_VALUE, action
				),
				justCalculated: false, touched: true, fromMemory: false
			});
			return true;
		}
		if (currentValue.length >= NUMBER_OF_DIGITS || fromMemory) {
			return false;
		}
		if (currentValue.includes(DOT) && action === DOT) {
			return false;
		}
		if (currentValue === START_VALUE && action === NUM0) {
			return false;
		}
		if (currentValue === START_VALUE && action !== DOT) {
			_this.setState({
				currentValue: action.toString(),
				justCalculated: false, touched: true, fromMemory: false
			});
			return true;
		}
		_this.setState({
			currentValue: String().concat(currentValue, action),
			justCalculated: false, touched: true, fromMemory: false
		});
		return true;
	}
	if (action === MC) {
		if (isNull(memory)) {
			return false;
		}
		_this.setState({memory: null});
		return true;
	}
	if (action === M_PLUS) {
		if (isNull(memory)) {
			_this.setState({memory: currentValue});
			return true;
		}
		try {
			_this.setState(
				{memory: (parseFloat(memory) + parseFloat(currentValue)).toString()}
			);
		}
		catch (err) {
			_this.setState({memory: null, isError: true});
			console.log(err);
		}
		return true;
	}
	if (action === MR) {
		if (isNull(memory)) {
			return false;
		}
		_this.setState({
			currentValue: memory, justCalculated: false,
			fromMemory: true, touched: false
		});
		return true;
	}
	if (binaryOperations.includes(action)) {
		if (!prevValue && (touched || fromMemory || justCalculated)) {
			_this.setState({
				prevValue: currentValue, currentValue: START_VALUE,
				justCalculated: false, fromMemory: false,
				touched: false, operation: action
			});
			return true;
		}
		if (!!prevValue && !(touched || fromMemory)) {
			_this.setState({operation: action});
			return true;
		}
		if (!!prevValue && !!currentValue && !!operation) {
			let {error, result} = calculateBinary(prevValue, currentValue, operation);
			
			if (!error && result !== 'Infinity' && result !== 'NaN') {
				_this.setState({
					prevValue: result, currentValue: START_VALUE,
					operation: action, justCalculated: false,
					fromMemory: false, touched: false
					});
			} else {
				_this.setState({isError: true});
			}
			return true;
		}
		return false;
	}
	if (action === EQUALS) {
		if (!prevValue || !operation) {
			return false;
		}
		if (justCalculated || !(touched || fromMemory)) {
			return false;
		}
		let {error, result} = calculateBinary(prevValue, currentValue, operation);
		
		if (!error && result !== 'Infinity' && result !== 'NaN') {
			_this.setState({
				prevValue: '', currentValue: result,
				operation: '', justCalculated: true,
				fromMemory: false, touched: false
			});
		} else {
			_this.setState({isError: true});
		}
		return true;
	}
	if (action === BACKSPACE) {
		if (!touched || fromMemory || justCalculated || !currentValue) {
			return false;
		}
		let offset = currentValue[0] === '-' ? 2 : 1;
		if (currentValue.length === offset) {
			_this.setState({
				currentValue: START_VALUE,
				justCalculated: false,
				fromMemory: false, touched: false
			});
			return true;
		}
		_this.setState({currentValue: dropRight(currentValue)});
		return true;
	}
	if (action === INV) {
		if (!touched || fromMemory || justCalculated || !currentValue) {
			return false;
		}
		let newValue = currentValue[0] === '-'
			? currentValue.split('-')[1]
			: String().concat('-', currentValue);

		_this.setState({currentValue: newValue});
		return true;
	}
	if (mathConstants.includes(action)) {
		let newValue = START_VALUE;
		switch (action) {
			case PI: newValue = Math.PI;
				break;
			case E: newValue = Math.E;
				break;
		}
		newValue = newValue.toString();
		_this.setState({
			currentValue: dropRight(newValue, 4), justCalculated: false,
			fromMemory: true, touched: false
		});
		return true;
	}
	if (action === RAD || action === DEG) {
		if ((action === RAD && radians) || (action === DEG && !radians)) {
			return false;
		}
		_this.setState({
			radians: action === RAD
		});
		return true;
	}
	if (unaryOperations.includes(action)) {
		if (!touched && !fromMemory && !justCalculated) {	
			return false;
		}
		let {error, result} = calculateUnary(currentValue, action, radians);
		
		if (!error && result !== 'Infinity' && result !== 'NaN') {
			_this.setState({
				currentValue: result,
				justCalculated: false,
				fromMemory: true, touched: false
			});
		} else {
			_this.setState({isError: true});
		}
		return true;
	}
};