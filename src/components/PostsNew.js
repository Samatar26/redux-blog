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
        <Field name="tags" label="Tags" component={this.renderField} />
        <Field
          name="content"
          label="Post content"
          component={this.renderField}
        />

      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = 'Enter a title!';
  }
  if (!values.categories) {
    errors.categories = 'Enter some categories';
  }
  if (!values.content) {
    errors.content = 'Enter some content please';
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'PostsNewForm',
})(PostsNew);
