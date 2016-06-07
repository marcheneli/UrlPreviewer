import UrlPreviewAPI from '../api';

export const FETCH_URL = 'FETCH_URL';
export const CHANGE_URL_INPUT = 'CHANGE_URL_INPUT';

export const fetchUrl = (url) => {
    return (dispatch) => {
        try{
            UrlPreviewAPI(url).then((preview) => {
                dispatch({
                    type: FETCH_URL,
                    payload: {
                        url: url,
                        preview: preview,
                        error: null
                    } 
                });
            }).catch((error) => {
                dispatch({
                    type: FETCH_URL,
                    payload: {
                        url: url,
                        preview: null,
                        error: "Url is not valid!"
                    } 
                });
            }).done();
        } catch(error) {
            dispatch({
                type: FETCH_URL,
                payload: {
                    url: url,
                    preview: null,
                    error: "Url is not valid!"
                } 
            });
        }
    };
    
}
export const changeUrlInput = (value) => {
    return {
        type: CHANGE_URL_INPUT,
        payload: value
    };
}