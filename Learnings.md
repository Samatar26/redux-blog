### React Router
Traditionally when a user clicks on a link, this issues a new request for a new webpage from a remote server. The purpose of React router is to circumvent this process, it intercepts changes to the url. It decides to display a different set of components depending on the url.

Example flow: When a user clicks on a link, the url inside the browser changes. The browser tells the history library (built-in react router) that the user has changed the url and gives it the new url. It parses this new url and figures out what has changed and passes it to React Router. React router then updates the components depending on the url. Once it has decided what components to display on the screen depending on the url, it dispatches a message to React to re-render itself based on the new components. This is known as SPA's (Single Page Applications). This means we're always dealing with one Html document.

```js
import {BrowserRouter, Route, } from 'react-router-dom';

```
BrowserRouter interacts with the History library and decides what to do based on the change in the url. The term BrowserRouter is saying that it wants React Router to look at the entire url when deciding what components should be rendered.
Route is a React component and it's purpose is to provide the configuration for which React components should be rendered depending on the url. _**They tie a component we create to a particular route the user may visit.**_

`<Route path="/posts/:id" component={PostsShow}/>`
You can put in a wildcard, which is :id or specifically just the `:`. If a user were to go to `/posts/anything` React Router will greedily match that url with the route and render the corresponding component.


### State as an object
With previous applications the way we designed our state would mean we might end up a posts property which would be an array and contains all of the posts inside of our application. We would also have something called active post, which is the selected post, the object the user is looking at. We don't need the second property because of React Router. The url the user is visiting is actually a critical piece of application state. E.g. the user visits a different url, we expect our application to update and we rerender different components. Therefore the current url we are looking at is another piece of state.
Since we are already reflecting the id of the post we are looking at inside of the url, we don't need to make another duplicate piece of state called active post.
We can take the posts property and look at id inside the url and use these two pieces of state/information to decide which post to render to the screen. That's step 1.

The other change is that it might make more sense to store our list of posts inside of an object, rather than an array. The Key will be the id of the post and the value will be the post itself. This will make it easier for us to find a particular post. If our posts were stored inside of an array we would have to use a for loop and map through our posts to look for the matching post based on id. Whereas with an object, we could do something as simple as `state.posts[postId]`. We pull the postId directly from the url.


Lodash has a method called `_.mapKeys(array, object property)` which makes it really easy to turn an array of objects into an object where the keys are the postids. MapKeys' first argument expects an array and the second argument is the property we want to pull off of each object to use as the key of the resulting object.

It also has a helper function called `_.map` which is useful when you're mapping through an object. In terms of performance, Object.keys is better than a for in. But neither beats a traditional for loop. So you could create an array of keys using `Object.keys(obj)` and loop through them using a for loop.

### Shortcut Action creator

In the past we've made use of the connect helper by defining the mapDispatchToProps function whenever we wanted to get action creator directly into our component so we can call it of the props object.
There's another way, which is a shortcut to define our action creator, like so:

```js
export default connect(null, { fetchPosts })(PostsIndex);

```

It is completely identical to the way we used to call it before with the mapDispatchToProps function. There are times you want to use the mapDispatchToProps, like when you want to do some computation on exactly how you want to call the action creator ahead of time. _**connect is taking care of that extra step of binding the dispatch function for us behind the scenes**_.

We'll make use of the `componentDidMount` lifecycle method to fetch our posts. This function will automatically be called by React as soon as the component has been rendered to the DOM. You might wonder why we're fetching our data _after_ the component has mounted. Fetching data is an asynchronous operation, fetching data from an api takes some time and React will not wait for the operation to be finished to render the component. Even if we call it within `componentWillMount` the component will render before the data has been retrieved.

### Fetch
When making a fetch request, if all you're doing is getting some data you can just pass in the url which will return a promise of the response. You can then return another promise by manipulating that data by turning it into a json for example. With a post request you have to supply a second argument like the headers and body.

```js
const url = `http://reduxblog.herokuapp.com/api/posts?key=Samatar267`;
fetch(url, {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Exams',
    categories: 'Education',
    content: 'Gotta study for it',
  }),
})
  .then(reponse => reponse.json())
  .then(data => console.log('Request succeeded with JSON response', data));
```
