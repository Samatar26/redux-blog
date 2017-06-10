import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPosts } from './../actions/index';

class PostsIndex extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  }

  renderPosts = () => {
    //Performance wise best solution!
    const postKeys = Object.keys(this.props.posts);
    const posts = [];
    for (var i = 0; i < postKeys.length; i++) {
      posts.push(
        <li>
          {this.props.posts[postKeys[i]].title}
        </li>
      );
    }
    return posts;
  };

  render() {
    return (
      <div>
        <h3>Posts</h3>
        <ul className="list-group">
          {this.renderPosts()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps({ posts }) {
  return { posts };
}

export default connect(mapStateToProps, { fetchPosts })(PostsIndex);
