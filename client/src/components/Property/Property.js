import React, { Component } from 'react';
import axios from 'axios';
import { Loading } from '../Loading/Loading';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

class PropertyComponent extends Component {
  state = {
    ethereum: {
      czk: 0,
    },
  };

  componentDidMount() {
    axios
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=CZK'
      )
      .then((response) => {
        this.setState({
          ethereum: {
            czk: response.data.ethereum.czk,
          },
        });
      })
      .catch((error) => {});
  }

  render() {
    const { properties, isLoading, errMess } = this.props;
    const { ethereum, propertyPriceNow } = this.state;

    if (isLoading) {
      return (
        <div className='col-12 col-md'>
          <Loading />
        </div>
      );
    } else if (errMess) {
      return (
        <div className='col-12 col-md m-5 d-flex justify-content-center'>
          <h4 className='text-danger'>{errMess}</h4>
        </div>
      );
    } else {
      return properties.map((property) => {
        return (
          <div
            className='card col-12 col-md-4 col-sm-6 mb-2 '
            key={property._id}
          >
            <Link to={`/property/${property._id}`}>
              <div className='card-body p-1'>
                <img
                  width='100%'
                  height='100%'
                  src={`/uploads/${property.image}`}
                  className='prop-image card-img'
                  alt={property.propertytitle}
                />
              </div>
            </Link>

            <div className='card-wrapper'>
              <div className=''>
                <div className='mb-1'>
                  <Link
                    to={`/property/${property._id}`}
                    className='card-property-title overflow-hidden'
                  >
                    {property.propertytitle}
                  </Link>
                </div>
                <div className='mb-1'>
                  <p className='text-purple'>{`${parseFloat(property.price)
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} ${
                    property.priceUnit
                  }`}</p>
                </div>
                <div className='mb-1'>
                  <p className='text-purple'>{`${(
                    property.price / ethereum.czk
                  ).toFixed(6)} ${`ETH`}`}</p>
                </div>
              </div>
              <div className=''>
                <div className=''>
                  <div className='card-property-address'>
                    {property.address}
                  </div>
                </div>
                <div className=''>{`${property.area} ${property.areaUnit}`}</div>
              </div>

              <div className='small '>
                <Moment format='MMM DD, YYYY'>{property.date}</Moment>
              </div>
            </div>
          </div>
        );
      });
    }
  }
}

export default PropertyComponent;
