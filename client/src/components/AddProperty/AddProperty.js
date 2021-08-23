import React, { Component } from 'react';
import axios from 'axios';
import { Control, Form, Errors } from 'react-redux-form';
import { Button, Label, Col, Row } from 'reactstrap';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => !val || val.length >= len;
const isNumber = (val) => !isNaN(Number(val));

class AddPropertyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      image: '',
      imageFile: null,
      latitude: '',
      longitude: '',
      minimumContribution: 0,
      errorMessage: '',
      loading: false,
      ethereum: {
        czk: 0,
      },
      suggestedPriceAtCreation: {
        ethereum: 0,
      },
      requiredPropertyPrice: {
        czk: 0,
        eth: 0,
      },
    };
  }
  componentDidMount() {
    this.props.resetAddPropertyForm();

    // this.props.resetEmailOwnerForm();
    // call should beexecuted in hadnle submit
  }

  handleSubmit = async (values) => {
    const {
      imageFile,
      latitude,
      longitude,
      image,
      minimumContribution,
      requiredPropertyPrice,
      description,
    } = this.state;
    // event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });
    if (imageFile === null) {
      alert('Please add Image of Property');
    } else if (latitude === '') {
      alert('Please Add Location');
    } else {
      const val = {
        ...values,
        image: image,
        latitude: latitude,
        longitude: longitude,
        email: this.props.auth.user.email,
      };
      const formData = new FormData();
      formData.append('image', imageFile);
      this.props.addImageToServer(formData);

      this.props.addProperty(val);
      this.props.resetAddPropertyForm();
    }

    try {
      const accounts = await web3.eth.getAccounts();
      console.log('accounts', accounts);
      console.log('minimumContribution,', minimumContribution);
      console.log('requiredPropertyPrice.eth', requiredPropertyPrice.eth);
      console.log('description', description);

      await factory.methods
        // .createCampaign(minimumContribution)
        .createCampaign(
          minimumContribution,

          requiredPropertyPrice.eth,

          description
        )
        .send({
          from: accounts[0],
        });

      // Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  requiredPriceHandler = (event) => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=CZK'
      )
      .then((response) => {
        console.log(response.data.ethereum.czk);
        this.setState(
          {
            ethereum: {
              czk: response.data.ethereum.czk,
            },
            suggestedPriceAtCreation: {
              ethereum:
                this.state.requiredPropertyPrice.czk /
                response.data.ethereum.czk,
            },
          },
          () => {
            console.log(this.state);
          }
        );
      })
      .catch((error) => {});
    this.setState({
      requiredPropertyPrice: {
        czk: event.target.value,
      },
    });
  };

  requiredEthPriceHandler = async (event) => {
    this.setState({
      requiredPropertyPrice: {
        eth: event.target.value,
      },
    });
  };

  minimumContributionHandler = (event) => {
    this.setState({
      minimumContribution: event.target.value,
    });
  };

  descriptionHandler = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  imageHandler = (event) => {
    if (event.target.files.length > 0) {
      this.setState((prevState) => ({
        image: event.target.files[0].name,
        imageFile: event.target.files[0],
      }));
    }
  };

  getLocation = (event) => {
    if (!navigator.geolocation) {
      return alert('Location not Supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      alert('Got Your Location :D');
    });
  };

  render() {
    const { suggestedPriceAtCreation } = this.state;
    return (
      <div className='container pt-5'>
        <div className='card p-5 '>
          <div className='card-title text-center p-4 text-dark'>
            <h3>Add property & campaign</h3>
          </div>
          <div className='card-body'>
            <Form
              model='addProperty'
              onSubmit={(value) => this.handleSubmit(value)}
            >
              <Row className='form-group'>
                <Label htmlFor='propertytitle' md={2}>
                  Property Title
                </Label>
                <Col md={6}>
                  <Control.text
                    model='.propertytitle'
                    id='propertytitle'
                    name='propertytitle'
                    placeholder='Property Title'
                    className='form-control'
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(30),
                    }}
                  />
                  <Errors
                    model='.propertytitle'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      minLength: 'Must be greater than 3 characters',
                      maxLength: 'Must be less than 30 Characters',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='for' md={2}>
                  For
                </Label>
                <Col md={6}>
                  <Control.select
                    model='.for'
                    name='for'
                    className='form-control'
                    defaultValue='Sale'
                  >
                    <option>Sale</option>
                    <option>Rent</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='price' md={2}>
                  Price
                </Label>
                <Col md={3}>
                  <Control.text
                    model='.price'
                    id='price'
                    name='price'
                    onChange={this.requiredPriceHandler}
                    placeholder={suggestedPriceAtCreation.ethereum}
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.price'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
                <Col md={3}>
                  <Control.select
                    model='.priceUnit'
                    name='priceUnit'
                    className='form-control'
                    defaultValue='Lac'
                  >
                    <option>Czk</option>
                    <option>Eur</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='priceEthereum' md={2}>
                  Required price in ETH
                </Label>
                <Col md={{ size: 3, offset: 0 }}>
                  <Control.text
                    model='.priceEthereum'
                    id='priceEthereum'
                    name='priceEthereum'
                    onChange={this.requiredEthPriceHandler}
                    placeholder={suggestedPriceAtCreation.ethereum * 1.05}
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.priceEthereum'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
                <Col md={{ size: 3, offset: 0 }}>
                  <span>{`Current price is ${
                    suggestedPriceAtCreation.ethereum
                  } ${`ETH`}`}</span>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='minimumContribution' md={2}>
                  Minimum Contribution in Wei
                </Label>
                <Col md={4}>
                  <Control.text
                    model='.minimumContribution'
                    id='minimumContribution'
                    name='minimumContribution'
                    onChange={this.minimumContributionHandler}
                    placeholder='100 Wei'
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.minimumContribution'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='bedrooms' md={2}>
                  No. of Bedrooms
                </Label>
                <Col md={6}>
                  <Control.text
                    model='.bedrooms'
                    id='bedrooms'
                    name='bedrooms'
                    placeholder='Bedrooms'
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.bedrooms'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='bathrooms' md={2}>
                  No. of Bathrooms
                </Label>
                <Col md={6}>
                  <Control.text
                    model='.bathrooms'
                    id='bathrooms'
                    name='bathrooms'
                    placeholder='bathrooms'
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.bathrooms'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Col md={{ size: 1, offset: 2 }}>
                  <div className='form-check'>
                    <Label check>
                      <Control.checkbox
                        model='.garage'
                        name='garage'
                        className='form-check-input'
                      />{' '}
                      Garage
                    </Label>
                  </div>
                </Col>
                <Col md={{ size: 1, offset: 1 }}>
                  <div className='form-check'>
                    <Label check>
                      <Control.checkbox
                        model='.lounge'
                        name='lounge'
                        className='form-check-input'
                      />{' '}
                      Lounge
                    </Label>
                  </div>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='address' md={2}>
                  Address
                </Label>
                <Col md={6}>
                  <Control.text
                    model='.address'
                    id='address'
                    name='address'
                    placeholder='Address'
                    className='form-control'
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(50),
                    }}
                  />
                  <Errors
                    model='.address'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      minLength: 'Must be greater than 3 characters',
                      maxLength: 'Must be less than 50 Characters',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='city' md={2}>
                  City
                </Label>
                <Col md={6}>
                  <Control.select
                    model='.city'
                    name='city'
                    className='form-control'
                    defaultValue='Praha'
                  >
                    <option>Praha</option>
                    <option>Brno</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='area' md={2}>
                  Area
                </Label>
                <Col md={3}>
                  <Control.text
                    model='.area'
                    id='area'
                    name='area'
                    placeholder='Area'
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                    }}
                  />
                  <Errors
                    model='.area'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
                <Col md={3}>
                  <Control.select
                    model='.areaUnit'
                    name='areaUnit'
                    className='form-control'
                    defaultValue='m2'
                  >
                    <option>m2</option>
                    <option>other unit</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='location' md={2}>
                  Location
                </Label>
                <Col md={{ size: 6, offset: 0 }}>
                  <Button className='btn-purple' onClick={this.getLocation}>
                    <span className='fa fa-location-arrow'> Get Location</span>
                  </Button>
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='images' md={2}>
                  Upload Images
                </Label>
                <Col md={6}>
                  <Control.file
                    model='image1'
                    id='image1'
                    name='image1'
                    className='form-control-file mb-2'
                    accept='image/jpg, image/jpeg'
                    onChange={this.imageHandler}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='contact' md={2}>
                  Contact No
                </Label>
                <Col md={3}>
                  <Control.text
                    model='.contact'
                    id='contact'
                    name='contact'
                    placeholder='+421*********'
                    className='form-control'
                    validators={{
                      required,
                      isNumber,
                      minLength: minLength(13),
                      maxLength: maxLength(13),
                    }}
                  />
                  <Errors
                    model='.contact'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                      minLength: 'Invalid Number',
                      maxLength: 'Invalid Number',
                      isNumber: 'Must be Number',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Label htmlFor='description' md={2}>
                  Detail Description
                </Label>
                <Col md={6}>
                  <Control.textarea
                    model='.description'
                    id='description'
                    name='description'
                    rows='12'
                    className='form-control'
                    placeholder='Your Description goes here...'
                    onChange={this.descriptionHandler}
                    validators={{
                      required,
                    }}
                  />
                  <Errors
                    model='.description'
                    className='text-danger'
                    show='touched'
                    messages={{
                      required: 'Required',
                    }}
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Col md={{ size: 6, offset: 2 }}>
                  <Button
                    loading={this.state.loading}
                    type='submit'
                    className='btn-block btn-purple'
                  >
                    Add Property
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPropertyComponent;
