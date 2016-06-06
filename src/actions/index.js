import URL from 'url';
import { Image } from 'react-native';
import htmlparser from 'htmlparser2';

import UrlPreviewAPI from '../api';

export const FETCH_URL = 'FETCH_URL';
export const CHANGE_URL_INPUT = 'CHANGE_URL_INPUT';

const YOUTUBE_API_KEY = 'AIzaSyB3WJBZS7J2mhnun0k-_32uUI15uwY3X8Y';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/';

const YOUTUBE_LOGO_URL = 'http://s.ytimg.com/yts/img/favicon_32-vfl8NGn4k.png';
const YOUTUBE_NAME = 'YouTube';

const SPORTS_RU_LOGO_URL = 'http://www.sports.ru/apple-touch-icon-76.png';
const SPORTS_RU_NAME = 'Sports.ru';


export const fetchUrl = (url) => {
    return (dispatch) => {
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
        });
    };
    
}
export const changeUrlInput = (value) => {
    return {
        type: CHANGE_URL_INPUT,
        payload: value
    };
}