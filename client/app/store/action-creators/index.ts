import * as playerActionCreators from './player';
import * as trackActionCreators from './tracks';
import * as alertActionCreators from './alert';

const actionCreators = {
  ...playerActionCreators,
  ...trackActionCreators,
  ...alertActionCreators,
};

export default actionCreators;
