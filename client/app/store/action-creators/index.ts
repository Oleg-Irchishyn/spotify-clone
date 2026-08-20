import * as albumActionCreators from './albums';
import * as alertActionCreators from './alert';
import * as authActionCreators from './auth';
import * as playerActionCreators from './player';
import * as trackActionCreators from './tracks';

const actionCreators = {
  ...playerActionCreators,
  ...trackActionCreators,
  ...albumActionCreators,
  ...alertActionCreators,
  ...authActionCreators,
};

export default actionCreators;
