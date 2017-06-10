export const FETCH_POSTS = 'fetch_posts';
const ROOT_URL = 'http://reduxblog.herokuapp.com/api';
const API_KEY = '?key=Samatar267';

export function fetchPosts() {
  const request = fetch(`${ROOT_URL}/posts${API_KEY}`).then(response =>
    response.json()
  );
  return {
    type: FETCH_POSTS,
    payload: request,
  };
}
