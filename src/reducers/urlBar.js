import { CHANGE_URL_INPUT } from '../actions';

export default (state = { url: '' }, action) => {
    switch (action.type){
        case CHANGE_URL_INPUT:
            return { url: action.payload };
        default:
            return state;
    }
};