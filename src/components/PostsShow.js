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
    console.log(this.props);
    const { post } = this.props;
    if (!post) {
      console.log(this.props);
      return <div>Loading....</div>;
    }
    return (
      <div>
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
export default connect(mapStateToProps, { fetchPost })(PostsShow);
