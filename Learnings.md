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
