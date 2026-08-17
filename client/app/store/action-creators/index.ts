import * as alertActionCreators from './alert';
import * as playerActionCreators from './player';
import * as trackActionCreators from './tracks';

const actionCreators = {
  ...playerActionCreators,
  ...trackActionCreators,
  ...alertActionCreators,
};

export default actionCreators;
