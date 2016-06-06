import { combineReducers } from 'redux';
import urlBar from './urlBar';
import urlPreviewer from './urlPreviewer';

export default combineReducers({
    urlBar,
    urlPreviewer
});