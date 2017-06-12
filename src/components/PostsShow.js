import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPost } from './../actions/index.js';
import { deletePost } from './../actions/index';

class PostsShow extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchPost(id);
    console.log(this.props);
  }

  onDeleteClick = () => {
    const { id } = this.props.match.params;
    this.props.deletePost(id, () => {
      this.props.history.push('/');
    });
  };

  render() {
    const { post } = this.props;
    if (!post) {
      console.log(this.props);
      return <div>Loading....</div>;
    }
    return (
      <div>
        <Link to="/" className="btn btn-primary">Back To Index</Link>
        <button
          className="btn btn-danger pull-xs-right"
          onClick={this.onDeleteClick}
        >
          Delete Post
        </button>
        <h3>{post.title}</h3>
        <h6>{post.categories}</h6>
        <p>{post.content}</p>
      </div>
    );
  }
}

const mapStateToProps = ({ posts }, ownProps) => {
  console.log('dada', posts);
  return { post: posts[ownProps.match.params.id] };
};
export default connect(mapStateToProps, { fetchPost, deletePost })(PostsShow);
