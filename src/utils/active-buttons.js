import {
	RAD, DEG
} from './constants';

export const isActive = ({btnTitle, radians}) => {
	
	return (btnTitle === RAD && radians) || (btnTitle === DEG && !radians);
};