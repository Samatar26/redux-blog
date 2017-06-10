import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
      const post = this.props.posts;
      posts.push(
        <li className="list-group-item" key={post[postKeys[i]].id}>
          {post[postKeys[i]].title}
        </li>
      );
    }
    return posts;
  };

  render() {
    return (
      <div>
        <div className="text-xs-right">
          <Link className="btn btn-primary" to="/posts/new">
            Add a post
          </Link>
        </div>
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
