import { connect } from 'react-redux';

import UrlBar from '../components/UrlBar';

import { fetchUrl, changeUrlInput } from '../actions';

const mapStateToProps = (state) => {
    return {
        url: state.urlBar.url
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFetchClick: (url) => { dispatch(fetchUrl(url)); },
        onUrlInputChange: (value) => { dispatch(changeUrlInput(value))}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UrlBar);