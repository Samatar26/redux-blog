export const FETCH_POSTS = 'fetch_posts';
export const CREATE_POST = 'create_post';
export const FETCH_POST = 'fetch_post';
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

export function fetchPost(id) {
  const request = fetch(`${ROOT_URL}/posts/${id}${API_KEY}`).then(response =>
    response.json()
  );
  console.log('action', request);
  return {
    type: FETCH_POST,
    payload: request,
  };
}
