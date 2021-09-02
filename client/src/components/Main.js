import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HomePage from './Home/Home';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ListProperties from './ListProperties/ListProperties';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import UserDashboard from './UserDashboard/UserDashboard';
import AddProperty from './AddProperty/AddProperty';
import PropertyDetail from './PropertyDetail/PropertyDetail';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../redux/actions/authActions';
import PrivateRoute from '../routes/PrivateRoute';
import {
  addImageToServer,
  addProperty,
  fetchProperties,
  fetchRecentProperties,
  removeProperty,
  sendEmailToOwner,
} from '../redux/actions/propertyActions';
import { actions } from 'react-redux-form';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    properties: state.properties,
    recent: state.recent,
    myProperties: state.myProperties,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (userData) => dispatch(loginUser(userData)),
  logoutUser: () => {
    dispatch(logoutUser());
  },
  registerUser: (userData) => dispatch(registerUser(userData)),
  addProperty: (newProperty) => dispatch(addProperty(newProperty)),
  addImageToServer: (image) => dispatch(addImageToServer(image)),
  fetchProperties: () => {
    dispatch(fetchProperties());
  },
  fetchRecentProperties: () => {
    dispatch(fetchRecentProperties());
  },
  resetAddPropertyForm: () => {
    dispatch(actions.reset('addProperty'));
  },
  resetEmailOwnerForm: () => {
    dispatch(actions.reset('contact'));
  },
  sendEmailToOwner: (data) => {
    dispatch(sendEmailToOwner(data));
  },
  removeProperty: (id) => dispatch(removeProperty(id)),
});

class Main extends Component {
  componentDidMount() {
    this.props.fetchProperties();
    this.props.fetchRecentProperties();
  }

  render() {
    return (
      <div>
        <Header
          loginUser={this.props.loginUser}
          registerUser={this.props.registerUser}
          logoutUser={this.props.logoutUser}
          auth={this.props.auth}
        />
        <Switch>
          <Route
            exact
            path='/'
            component={() => (
              <HomePage
                isLoading={this.props.properties.isLoading}
                errMess={this.props.properties.errMess}
                recentProperties={this.props.recent.recent}
              />
            )}
          />
          <Route
            path='/list'
            component={() => (
              <ListProperties
                properties={this.props.properties.properties}
                isLoading={this.props.properties.isLoading}
                errMess={this.props.properties.errMess}
              />
            )}
          />
          {/* <PrivateRoute */}
          <Route exact path='/admin/dashboard' component={AdminDashboard} />
          {/* <PrivateRoute */}
          <Route
            exact
            path='/user/dashboard'
            component={() => (
              <UserDashboard
                myProperties={this.props.myProperties.myProperties}
                isLoading={this.props.myProperties.isLoading}
                errMess={this.props.myProperties.errMess}
                removeProperty={this.props.removeProperty}
              />
            )}
          />
          {/* <PrivateRoute */}
          <Route
            path='/property/add'
            component={() => (
              <AddProperty
                addProperty={this.props.addProperty}
                addImageToServer={this.props.addImageToServer}
                resetAddPropertyForm={this.props.resetAddPropertyForm}
                auth={this.props.auth}
                addedProperty={this.props.properties.addedProperty}
              />
            )}
          />
          <Route
            path='/property/:id'
            component={({ match }) => (
              <PropertyDetail
                property={
                  this.props.properties.properties.filter(
                    (property) => property._id === match.params.id
                  )[0]
                }
                isLoading={this.props.properties.isLoading}
                errMess={this.props.properties.errMess}
                resetEmailOwnerForm={this.props.resetEmailOwnerForm}
                sendEmailToOwner={this.props.sendEmailToOwner}
              />
            )}
          />
          <Redirect to='/' />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
