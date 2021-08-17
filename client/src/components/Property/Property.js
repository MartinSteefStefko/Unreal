import React from 'react';
import { Loading } from '../Loading/Loading';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
const PropertyComponent = ({ properties, isLoading, errMess }) => {
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
          className='card card-hover col-12 col-md-4 col-sm-6 mb-2'
          key={property._id}
        >
          <Link to={`/property/${property._id}`}>
            <div className='card-body p-0'>
              <img
                src={`/uploads/${property.image}`}
                className='prop-image card-img'
                alt={property.propertytitle}
              />
            </div>
          </Link>

          <div className='card-footer'>
            <div className='row'>
              <div className='col-md-8'>
                <Link to={`/property/${property._id}`}>
                  <p className='card-property-title overflow-hidden'>
                    {property.propertytitle}
                  </p>
                </Link>
              </div>
              <div className='col-md-4'>
                <p className='text-success'>{`RS: ${property.price} ${property.priceUnit}`}</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-12 col-md-8'>
                <div className='card-property-address'>{property.address}</div>
              </div>
              <div className='col-12 col-md-4 text-primary'>
                {`${property.area} ${property.areaUnit}`}
              </div>
            </div>

            <div className='small'>
              <Moment format='MMM DD, YYYY'>{property.date}</Moment>
            </div>
          </div>
        </div>
      );
    });
  }
};

export default PropertyComponent;
