import _ from 'lodash';
import { FETCH_POSTS, FETCH_POST, DELETE_POST } from './../actions/index';

export default function(state = {}, action) {
  console.log('dadadadadadakjiujkkj', action.payload);
  switch (action.type) {
    case DELETE_POST:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    case FETCH_POST:
      return { ...state, [action.payload.id]: action.payload };

    case FETCH_POSTS:
      return _.mapKeys(action.payload, 'id');
    default:
      return state;
  }
}
