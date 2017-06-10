export const FETCH_POSTS = 'fetch_posts';
export const CREATE_POST = 'create_post';

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

export function createPost(values, cb) {
  const request = fetch(`${ROOT_URL}/posts${API_KEY}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
    .then(response => response.json())
    .then(data => cb());

  return {
    type: CREATE_POST,
    payload: request,
  };
}
