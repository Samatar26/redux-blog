import _ from 'lodash';
import { FETCH_POSTS, FETCH_POST } from './../actions/index';

export default function(state = {}, action) {
  console.log('dadadadadadakjiujkkj', action.payload);
  switch (action.type) {
    case FETCH_POST:
      return { ...state, [action.payload.id]: action.payload };

    case FETCH_POSTS:
      return _.mapKeys(action.payload, 'id');
    default:
      return state;
  }
}
