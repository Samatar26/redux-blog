import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class PostsNew extends Component {
  renderField = field => {
    const { meta: { touched, error } } = field;
    const formClass = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={formClass}>
        <label>
          {field.label}
        </label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  };

  onSubmit = values => {
    console.log(values);
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          name="title"
          label="Title For Post"
          component={this.renderField}
        />

        <Field
          name="categories"
          label="Categories"
          component={this.renderField}
        />

        <Field
          name="content"
          label="Post content"
          component={this.renderField}
        />

        <button type="submit" className="btn btn-primary">Submit</button>

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
