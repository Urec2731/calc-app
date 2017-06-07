import { isNull } from 'lodash';
import {
	MC, MR, M_PLUS
} from './constants';

const memoryKeys = [MC, MR, M_PLUS];

const canDisabled = (btnTitle) => memoryKeys.includes(btnTitle);

export const isDisabled = ({btnTitle, memoryValue, isError}) => {
	if (!canDisabled(btnTitle)) {
		return false;
	}
	if (isError) {
		return true;
	}
	if ((btnTitle === MC || btnTitle === MR) && isNull(memoryValue)) {
		return true;
	}
	return false;
};