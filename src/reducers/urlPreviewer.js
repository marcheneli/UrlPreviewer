import { FETCH_URL } from '../actions';

export default (state = null, action) => {
    switch (action.type){
        case FETCH_URL:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};