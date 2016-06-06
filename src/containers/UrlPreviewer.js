import { connect } from 'react-redux';
import UrlPreviewer from '../components/UrlPreviewer';

const mapStateToProps = (state) => {
    return {
        info: state.urlPreviewer
    };
};

export default connect(mapStateToProps)(UrlPreviewer);