import axios from 'axios';
import * as ActionTypes from './types';
import { getCurrentUser } from './authActions';
import { property_all } from '../../mocks/property_all';
import { property_recent } from '../../mocks/property_recent';
import { uploads_property } from '../../mocks/uploads_property';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

export const addProperty = (newProperty) => async (dispatch) => {
  const campaign = await addCampaign(uploads_property);
  const updatedProperty = { ...uploads_property, campaign };
  const result = dispatch(addNewProperty(updatedProperty));
  console.log('result', result);

  dispatch(fetchRecentProperties());

  // axios
  //   .post('http://localhost:5000/api/uploads/property', newProperty)
  //   .then((response) => {
  //     dispatch(addNewProperty(response.data));
  //     dispatch(fetchRecentProperties());
  //     alert('Property is successfully added');
  //   })
  //   .catch((error) => {});
};
// export const addCampaign = (result) => async (dispatch) => {
export const addCampaign = async (result) => {
  // dispatch(myPropertiesLoading(true));
  // axios
  //   .get(`http://localhost:5000/api/property/my/${email}`)
  //   .then((res) => {
  //     if (res.status === 200) {
  //       dispatch(addMyProperties(res.data));
  //     }
  //   })
  //   .catch((err) => {
  //     dispatch(myPropertiesFailed(err.message));
  //   });
  const { minimumContribution, requiredPropertyPrice, _id } = result;
  try {
    const accounts = await web3.eth.getAccounts();

    const res = await factory.methods
      .createCampaign(
        minimumContribution,
        web3.utils.toWei(requiredPropertyPrice.eth, 'ether'),
        _id
      )
      .send({
        from: accounts[0],
      });
    const campaign = {
      address: web3.eth.abi.decodeParameter(
        'address',
        res.events.campaignDeployed.raw.data
      ),
    };
    return campaign;

    // Router.pushRoute('/');
  } catch (err) {
    throw err;
    // this.setState({ errorMessage: err.message });
  }
};

export const fetchProperties = () => (dispatch) => {
  dispatch(propertiesLoading(true));
  dispatch(addProperties(property_all));
  // dispatch(getCurrentUser());
  // axios.get("http://localhost:5000/api/property/all")
  //     .then((response) => {
  //         dispatch(addProperties(response.data));
  // axios.get("http://localhost:5000/api/property/all")
  //     .then((response) => {
  //         dispatch(addProperties(response.data));
  //     }).catch((error) => {
  //         dispatch(propertiesFailed(error.message));
  // });
};

export const propertiesLoading = () => ({
  type: ActionTypes.PROPERTY_LOADING,
});
export const propertiesFailed = (errMess) => ({
  type: ActionTypes.PROPERTY_ERROR,
  payload: errMess,
});

export const addNewProperty = (property) => ({
  type: ActionTypes.ADD_PROPERTY,
  payload: property,
});
export const addProperties = (properties) => ({
  type: ActionTypes.ADD_PROPERTIES,
  payload: properties,
});

export const fetchRecentProperties = () => (dispatch) => {
  dispatch(recentPropertiesLoading(true));
  dispatch(addRecentProperties(property_recent));
  // dispatch(getCurrentUser());
  // axios.get("http://localhost:5000/api/property/recent")
  //     .then((response) => {
  //         dispatch(addRecentProperties(response.data));
  //     }).catch((error) => {
  //     dispatch(recentPropertiesFailed(error.message));
  // });
};

export const recentPropertiesLoading = () => ({
  type: ActionTypes.RECENT_LOADING,
});
export const recentPropertiesFailed = (errMess) => ({
  type: ActionTypes.RECENT_FAILED,
  payload: errMess,
});

export const addRecentProperties = (property) => ({
  type: ActionTypes.ADD_RECENT,
  payload: property,
});

export const addImageToServer = (image) => (dispatch) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  axios
    .post('http://localhost:5000/api/uploads/image', image, config)
    .then((response) => {
      console.log('Images Uploaded');
    })
    .catch((error) => {});
};

export const sendEmailToOwner = (data) => (dispatch) => {
  axios
    .post('http://localhost:5000/api/property/contact', data)
    .then((response) => {
      alert('Email Sent :D');
    })
    .catch((error) => {
      console.log(error);
    });
};
export const fetchMyProperties = (email) => (dispatch) => {
  dispatch(myPropertiesLoading(true));
  axios
    .get(`http://localhost:5000/api/property/my/${email}`)
    .then((res) => {
      if (res.status === 200) {
        dispatch(addMyProperties(res.data));
      }
    })
    .catch((err) => {
      dispatch(myPropertiesFailed(err.message));
    });
};
export const removeProperty = (id) => (dispatch) => {
  axios
    .delete(`http://localhost:5000/api/property/my/delete/${id}`)
    .then((res) => {
      if (res.status === 200) {
        dispatch(removeMyProperty(id));
        dispatch(fetchProperties());
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
};

export const addMyProperties = (properties) => ({
  type: ActionTypes.ADD_MY_PROPERTIES,
  payload: properties,
});
export const removeMyProperty = (id) => ({
  type: ActionTypes.REMOVE_MY_PROPERTY,
  payload: id,
});
export const myPropertiesLoading = () => ({
  type: ActionTypes.MY_PROPERTIES_LOADING,
});
export const myPropertiesFailed = (errMess) => ({
  type: ActionTypes.MY_PROPERTIES_FAILED,
  payload: errMess,
});
