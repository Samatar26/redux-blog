### React Router
Traditionally when a user clicks on a link, this issues a new request for a new webpage from a remote server. The purpose of React router is to circumvent this process, it intercepts changes to the url. It decides to display a different set of components depending on the url.

Example flow: When a user clicks on a link, the url inside the browser changes. The browser tells the history library (built-in react router) that the user has changed the url and gives it the new url. It parses this new url and figures out what has changed and passes it to React Router. React router then updates the components depending on the url. Once it has decided what components to display on the screen depending on the url, it dispatches a message to React to re-render itself based on the new components. This is known as SPA's (Single Page Applications). This means we're always dealing with one Html document.

React router loosely matches the path property against the current route the user is looking at. So if we're rendering the home component at `path="/"` and the user navigates to the login component at `path="/login"`, _**both components will be rendered**_. This is due to React Router's matching system. You should therefore use `exact path = "/"`, this way the home component will only be rendered if the route only contains a `/` and nothing else, so only if the pathname matches the route's patch _exactly_.

```js
import {Switch} from 'react-router-dom';
```
You can use the `<Switch>` component to group routes. The `<Switch>` component will iterate over its _children_ elements (the routes) and only render the first one that matches the current pathname.

```js
import {Link} from 'react-router-dom';
```
The `<Link>` component is used as an anchor link which allows users to navigate to a route. Instead of specifying a `href` attribute, you specify a `to` property. When the link tag is rendered it's actually an anchor tag, but React Router provides the Link tag with a couple of event handlers which stops the page from refreshing for example when navigating to a different route to fetch a new page.


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

### Redux form
We will need several different inputs for our form and we also probably want to validate these inputs. Redux form is all about handling any type of form you put together with Redux, validating the input and submitting the form in some fashion.


First step of setting up Redux-Form is in your reducers folder. We have to import a reducer from the redux-form library and hook it up to our combineReducers call. Internally, redux-form uses our Redux instance or our instance of the Redux store for handling all the state that's being produced by the form. (The actual form that's being rendered to the screen). Therefore all it's doing is saving us from wiring up some manual action creators.

![redux-form](https://user-images.githubusercontent.com/22747985/27004469-6c3dbe78-4e01-11e7-83c3-19bc85b32079.png)

We have 3 different pieces of state; Title, Category and content. For each different piece of state we will have to make a _field_ component. A field component is created by Redux-Form for us, all we have to tell Redux-form is what type of input we want to receive from the user, e.g. radio-box, checkbox, file-upload, text-input, etc. Then our user might change the _field_ input at some point in time. Whenever we want to handle inputs in React, we need to create an onchange handler, set our state and set the value upon the inpu ourself. Redux form automatically handles any changes that are made to any input of any type inside our application. When the user submits the form, we will pass two callbacks to Redux-form that validates the input the user provided and we'll also handle form submittal.


In our `PostsNew` component, we'll import `Field` and `reduxForm` from `redux-form`. Field is a react Component. reduxForm is a function which is very similar to the connect function from `react-redux`. It's what allows our component to communicate with that additional reducer that we just wired in. It's what allows our component to talk directly to the redux store. We pass in a single argument, which is a function that takes some number of different configuration options. We are only going to specifiy the form option. You can think of the form property as the name of the form. You might want to show multiple forms on one given screen. This is what the form property helps us with, by providing a unique string, we ensure that reduxForm handles all these different forms correctly and won't try and merge state for multiple different forms into one single piece of state. Therefore make sure the string you pass into the form property is unique!
```js
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class PostsNew extends Component {
  render() {
    return (
      <div>
      PostsNew!
      </div>
    );
  }
}

export default PostsNew;

```

#### Field component
The first property that we pass into our `Field` component is the name property. It's essentially the piece of state we are trying to describe, the piece of state the user is editing. The Field component knows how to communicate with Redux-Form by default, which saves us from wiring up all those different event handlers, action creators, etc. Redux form is going to help us with that side of things and the Field component is key in that equation as it knows how to wire up all of these things. The shortcoming of the Field component is that it does not know how to produce some amount of JSX to show on the screen to our users. This is the purpose of the component property as it adds in a function that will return some amount of JSX which will be used to show that Field on the screen.  

The field will call the function we pass into component which will return some amount of JSX. We do still however have to wire up the JSX to the field component, therefore our helper function will be called with an argument we call `field` by convention. This field object contains some event handlers that we need to wire up to the JSX that we're returning. The field component needs to know which element it has to track.

`field.input` is an object that contains a bunch of different event handlers and a bunch of different props. E.g. onclick, onblur, onfocus, onchange, etc. It also has the value of the input.   

You can pass arbitrary properties to the Field component which will be passed on into the field argument inside our renderField function.

```js
### React Router
Traditionally when a user clicks on a link, this issues a new request for a new webpage from a remote server. The purpose of React router is to circumvent this process, it intercepts changes to the url. It decides to display a different set of components depending on the url.

Example flow: When a user clicks on a link, the url inside the browser changes. The browser tells the history library (built-in react router) that the user has changed the url and gives it the new url. It parses this new url and figures out what has changed and passes it to React Router. React router then updates the components depending on the url. Once it has decided what components to display on the screen depending on the url, it dispatches a message to React to re-render itself based on the new components. This is known as SPA's (Single Page Applications). This means we're always dealing with one Html document.

React router loosely matches the path property against the current route the user is looking at. So if we're rendering the home component at `path="/"` and the user navigates to the login component at `path="/login"`, _**both components will be rendered**_. This is due to React Router's matching system. You should therefore use `exact path = "/"`, this way the home component will only be rendered if the route only contains a `/` and nothing else, so only if the pathname matches the route's patch _exactly_.

```js
import {Switch} from 'react-router-dom';
```
You can use the `<Switch>` component to group routes. The `<Switch>` component will iterate over its _children_ elements (the routes) and only render the first one that matches the current pathname.

```js
import {Link} from 'react-router-dom';
```
The `<Link>` component is used as an anchor link which allows users to navigate to a route. Instead of specifying a `href` attribute, you specify a `to` property. When the link tag is rendered it's actually an anchor tag, but React Router provides the Link tag with a couple of event handlers which stops the page from refreshing for example when navigating to a different route to fetch a new page.


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

### Redux form
We will need several different inputs for our form and we also probably want to validate these inputs. Redux form is all about handling any type of form you put together with Redux, validating the input and submitting the form in some fashion.


First step of setting up Redux-Form is in your reducers folder. We have to import a reducer from the redux-form library and hook it up to our combineReducers call. Internally, redux-form uses our Redux instance or our instance of the Redux store for handling all the state that's being produced by the form. (The actual form that's being rendered to the screen). Therefore all it's doing is saving us from wiring up some manual action creators.

![redux-form](https://user-images.githubusercontent.com/22747985/27004469-6c3dbe78-4e01-11e7-83c3-19bc85b32079.png)

We have 3 different pieces of state; Title, Category and content. For each different piece of state we will have to make a _field_ component. A field component is created by Redux-Form for us, all we have to tell Redux-form is what type of input we want to receive from the user, e.g. radio-box, checkbox, file-upload, text-input, etc. Then our user might change the _field_ input at some point in time. Whenever we want to handle inputs in React, we need to create an onchange handler, set our state and set the value upon the inpu ourself. Redux form automatically handles any changes that are made to any input of any type inside our application. When the user submits the form, we will pass two callbacks to Redux-form that validates the input the user provided and we'll also handle form submittal.


In our `PostsNew` component, we'll import `Field` and `reduxForm` from `redux-form`. Field is a react Component. reduxForm is a function which is very similar to the connect function from `react-redux`. It's what allows our component to communicate with that additional reducer that we just wired in. It's what allows our component to talk directly to the redux store. We pass in a single argument, which is a function that takes some number of different configuration options. We are only going to specifiy the form option. You can think of the form property as the name of the form. You might want to show multiple forms on one given screen. This is what the form property helps us with, by providing a unique string, we ensure that reduxForm handles all these different forms correctly and won't try and merge state for multiple different forms into one single piece of state. Therefore make sure the string you pass into the form property is unique!
```js
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class PostsNew extends Component {
  render() {
    return (
      <div>
      PostsNew!
      </div>
    );
  }
}

export default PostsNew;

```

#### Field component
The first property that we pass into our `Field` component is the name property. It's essentially the piece of state we are trying to describe, the piece of state the user is editing. The Field component knows how to communicate with Redux-Form by default, which saves us from wiring up all those different event handlers, action creators, etc. Redux form is going to help us with that side of things and the Field component is key in that equation as it knows how to wire up all of these things. The shortcoming of the Field component is that it does not know how to produce some amount of JSX to show on the screen to our users. This is the purpose of the component property as it adds in a function that will return some amount of JSX which will be used to show that Field on the screen.  

The field will call the function we pass into component which will return some amount of JSX. We do still however have to wire up the JSX to the field component, therefore our helper function will be called with an argument we call `field` by convention. This field object contains some event handlers that we need to wire up to the JSX that we're returning. The field component needs to know which element it has to track.

`field.input` is an object that contains a bunch of different event handlers and a bunch of different props. E.g. onclick, onblur, onfocus, onchange, etc. It also has the value of the input.   

You can pass arbitrary properties to the Field component which will be passed on into the field argument inside our renderField function.

When validating our form submission, we hook into our reduxForm system validation. The first thing we do is define a helper function called validate and we pass in this function as a configuration option called validate. This validation function is automatically called whenever the user tries to submit the form. The function is given a single argument which is called values by convention, this is an object which contains all of the different values that a user has entered into the form. e.g. for us
`{title: 'aaa', categories: 'diada', content: 'dada'}`. In order to validate these inputs and communicate any possible errors back to redux form, we have to return an object that we create from the validate function. So we start off by creating an errors object, which is empty initially. If we return an empty object, redux form assumes there aren't any errors and the form is valid. If any properties are appended to the errors object, the form is invalid. the name property and the property we use within the validate function must be identical for the error to show up. The error can be accessed inside our renderField function using `{field.meta.error}`. This will return a string which is the exact same string we provided in our validate function.

```js
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class PostsNew extends Component {
  renderField = field => {
    return (
      <div className="form-group">
        <label>
          {field.label}
        </label>
        <input className="form-control" type="text" {...field.input} />
      </div>
    );
  };

  renderTagsField = field => {};
  render() {
    return (
      <form>
        <Field name="title" label="Title" component={this.renderField} />
        <Field name="categories" label="Categories" component={this.renderField} />
        <Field
          name="content"
          label="Post content"
          component={this.renderField}
        />
        {field.meta.error}

      </form>
    );
  }
}

function validate(values){
  const errors = {};

  //validate the inputs from 'values'
  if (!values.title){
    errors.title="Enter a title";
  }

  // if errors is empty, the form is fine to submit
  // if errors has any properties, redux from assumes form is invalid
  return errors;
}

export default reduxForm({
  validate,
  form: 'PostsNewForm',
})(PostsNew);




```

#### Handling Form submittal
Redux form does not handle like posting the data from our form to a backend server. We want to involve Redux-Form with our onsubmit, but we also need to interject some of our own custom logic as well for taking those values and doing something interesting with them. Redux form is only responsible for handling the state and validation of our form. It is not responsible for handling anything like making a post request or saving the data. Therefore handleSubmit, takes a function we define and we pass it to handleSubmit and handleSubmit runs the redux form side of things like validation, etc. When everything's okay and ready to submit, it calls the function we defined and gives us the value out of the form for us to work on.

```js

onSubmit = values => {
  console.log(values);
};

render() {
  const { handleSubmit } = this.props;
  return (
    <form onSubmit={handleSubmit(this.onSubmit)}>
```


There are 3 different states of our form for each and every field we create for our form.
- pristine
This is the state how every single input is rendered by default. No input has touched it yet, and the user has not yet selected it.
- touched
The user has selected/focused on the input, then focused out of the input. The user has done some work on this field and then consideres it complete.
- invalid
This is where we have an error message and we need to display it in some sort of fashion.

Therefore in our validation we can make use of the touched property like so: `{field.meta.touched ? field.meta.error : ''}`

We can use ES6 destructuring like so:
`const { meta: { touched, error } } = field;`, this allows us to pull off nested properties of objects. So we're essentially saying in the meta property of field, pull of the touched and error key-value pairs.


### Using Connect and Redux form
We can still hook up the connect helper and combine the connect helper and the redux form helper. We wrap the connect helper around the component as usual and this returns a React Component, which is a valid input to Redux form.

```js
export default reduxForm({
  validate,
  form: 'PostsNewForm',
})(
  connect(null, { createPost })(PostsNew)
);
```

### Navigation through callbacks
To handle programatic navigation, react router passes in a big set of props into our component that's being rendered by a route. Whenever React Router renders a component, it passes in a whole bunch of different helpers and objects for helping with navigation to that component that's rendered by that route. The prop we're interested in is `this.props.history.push('/')`. If we call history with a route, whenever that piece of code is executed, we'll be automatically be navigated to that route. The big challenge is that we only want to navigate the user back to the list of posts page, after the post has been created. We dcan do this by passing in a callback to our action creator:

```js
onSubmit = values => {
  this.props.createPost(values, () => {
    this.props.history.push('/');
  });
};


//Action creator
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


```

We should always assume that the user can enter into your application on any given page. Therefore the postsShow component needs to be responsible for fetching its own data. We need access to the id, the token inside the url, which is a very important piece of state that dictates how our component will behave. We can access this by using `this.props.match.params` which is provided by us by reac-router. The params object gives us access to all of the different wildcards inside of our url.

### Selecting from ownProps
The mapStateToProps has a second argument which is referred to as ownProps. It's the props object that is headed, going to the component. Therefore whenever PostsShow is rerendered or about to be rerendered, mapStateToProps is passed all the props that are headed to postsShow. Therefore rather than returning the big lists of posts, we can return the single post we care about. You might think, what's the difference since we're still dealing with the massive posts object in our mapStateToProps function. Well there is a difference as in many large applications, your mapStateToProps function would be in a completely different file. This makes your component way more reusable. It also helps to clean up your component. 

```js
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchPost } from './../actions/index.js';

class PostsShow extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchPost(id);
  }

  render() {
    return (
      <div>
        Ga
      </div>
    );
  }
}

const mapStateToProps = ({ posts }, ownProps) => {
  return { post: posts[ownProps.match.params.id] };
};
export default connect(mapStateToProps, { fetchPost })(PostsShow);


```

Note: You can pass in variables for keys by wrapping it in square braces, like so:
`return { ...state, [action.payload.id]: action.payload };`
