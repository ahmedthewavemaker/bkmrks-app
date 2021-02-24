import React, { Component } from 'react';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import EditBookmark from './EditBookmark/EditBookmark'
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

const bookmarks = [
  // {
  //   id: 0,
  //   title: 'Google',
  //   url: 'http://www.google.com',
  //   rating: '3',
  //   desc: 'Internet-related services and products.'
  // },
  // {
  //   id: 1,
  //   title: 'Thinkful',
  //   url: 'http://www.thinkful.com',
  //   rating: '5',
  //   desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  // },
  // {
  //   id: 2,
  //   title: 'Github',
  //   url: 'http://www.github.com',
  //   rating: '4',
  //   desc: 'brings together the world\'s largest community of developers.'
  // }
];

class App extends Component {
  state = {
    page: 'list',
    bookmarks,
    error: null,
  };

  changePage = (page) => {
    this.setState({ page })
  }

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    })
  }


  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm =>
      bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }


  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }


  updateBookmark = updateBookmark => {
    this.setState({
      bookmarks: this.state.bookmarks.map(bm =>
        (bm.id !== updateBookmark.id) ? bm : updateBookmark
      )
    })
  }
  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark

    }


    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav clickPage={this.changePage} />
          <div className='content' aria-live='polite'>
            <Route
              exact
              path='/'
              component={BookmarkList} />


            <Route
              path='/add-bookmark'
              component={AddBookmark}
            />

            <Route
              path = 'edit-bookmark'
              component={EditBookmark}
            />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
