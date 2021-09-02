import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Property from '../Property/Property';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: {
        Praha: '0',
        Brno: '0',
      },
      for: {
        sale: '0',
        rent: '0',
      },
    };
  }
  componentWillMount() {
    // axios
    //   .get('http://localhost:5000/api/property/count/Praha')
    //   .then((response) => {
    //     this.setState(
    //       {
    //         city: {
    //           ...this.state.city,
    //           Praha: response.data,
    //         },
    //       },
    //       () => {
    //         console.log(this.state);
    //       }
    //     );
    //   })
    //   .catch((error) => {});
    this.setState({
      city: {
        ...this.state.city,
        Praha: '4',
      },
    });
    // axios
    //   .get('http://localhost:5000/api/property/count/Brno')
    //   .then((response) => {
    //     this.setState(
    //       {
    //         city: {
    //           ...this.state.city,
    //           Brno: response.data,
    //         },
    //       },
    //       () => {
    //         console.log(this.state);
    //       }
    //     );
    //   })
    //   .catch((error) => {});
    this.setState({
      city: {
        ...this.state.city,
        Brno: '2',
      },
    });
    axios
      .get('http://localhost:5000/api/property/count/for/Sale')
      .then((response) => {
        this.setState(
          {
            for: {
              ...this.state.for,
              sale: response.data,
            },
          },
          () => {
            console.log(this.state);
          }
        );
      })
      .catch((error) => {});
    axios
      .get('http://localhost:5000/api/property/count/for/Rent')
      .then((response) => {
        this.setState(
          {
            for: {
              ...this.state.for,
              rent: response.data,
            },
          },
          () => {
            console.log(this.state);
          }
        );
      })
      .catch((error) => {});
  }

  render() {
    const { recentProperties, isLoading, errMess } = this.props;
    return (
      <Fragment>
        <div className='container'>
          <div className='text-white'>
            <div className='container pt-5'>
              <div className='row mt-5 '>
                <div className='col-12 col-md p-5 text-center carouselWrapper'>
                  {/* <a href='https://www.vecteezy.com/free-vector/woman'>
                    Woman Vectors by Vecteezy
                  </a> */}
                  {/* <h1 className='home-title'>{`Choose from ${600} dream realitites!`}</h1> */}
                  <div className='carousel-text-wrapper'>
                    <h2 className='carousel-text pt-4'>
                      {`Buy properties with blockchain for as little as  ${`100 Wei`} `}
                    </h2>
                  </div>

                  <Link to='/list' className='btn btn-purple btn-lg mt-5 mb-4'>
                    Check Out
                  </Link>
                  <hr />
                </div>
              </div>
            </div>
            <br />
            <hr />
            <div className='container'>
              <div className='row mt-2'>
                <div className='col-6 col-md-3 '>
                  <div className='card'>
                    <div className='card-title link-green text-center p-2'>
                      <h3 className=''>Property Purpose</h3>
                    </div>
                    <div className='card-body text-dark text-center'>
                      <p>
                        Sale{' '}
                        <span className='badge badge-primary'>
                          {this.state.for.sale}
                        </span>
                      </p>
                      <p>
                        Rent{' '}
                        <span className='badge badge-success'>
                          {this.state.for.rent}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-6 col-md-3 '>
                  <div className='card'>
                    <div className='card-title link-green text-center p-2'>
                      <h3 className=''>Cities</h3>
                    </div>
                    <div className='card-body text-dark text-center'>
                      <p>
                        Praha{' '}
                        <span className='badge badge-danger'>
                          {this.state.city.Praha}
                        </span>
                      </p>
                      <p>
                        Brno{' '}
                        <span className='badge badge-warning'>
                          {this.state.city.Brno}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-5 bg-green'>
              <div className='col-12 col-md p-2 text-center'>
                <h4 className=''>Recently Listed Properties</h4>
              </div>
            </div>
          </div>
          <hr />

          <div className='container mt-5'>
            <div className='row'>
              <Property
                properties={recentProperties}
                isLoading={isLoading}
                errMess={errMess}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;
