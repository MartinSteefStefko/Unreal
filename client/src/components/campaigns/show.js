import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import { Button } from 'reactstrap';
// import Layout from '../../components/';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm/ContributeForm';
import RequestIndex from '../campaigns/requests/index.js';
import { Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class CampaignShow extends Component {
  // static async getInitialProps(props) {
  //   const campaign = Campaign(props.query.address);

  //   const summary = await campaign.methods.getSummary().call();

  //   return {
  //     address: props.query.address,
  //     minimumContribution: summary[0],
  //     balance: summary[1],
  //     requestsCount: summary[2],
  //     approversCount: summary[3],
  //     manager: summary[4],
  //   };
  // }

  state = {
    address: '121212',
    minimumContribution: '0',
    balance: '0',
    requestsCount: '0',
    approversCount: ' 0',
    manager: '',
    viewRequests: false,
  };

  async componentDidMount() {
    const address = this.props.property.campaign.address;
    console.log('address', address);
    const campaign = Campaign(address);
    console.log('campaign', campaign);
    const summary = await campaign.methods.getSummary().call();
    console.log('summary', summary);
    this.setState({
      address: address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      requiredPrice: summary[5],
    });
  }

  onClickHandler = (event) => {
    event.preventDefault();
    this.setState({
      viewRequests: !this.state.viewRequests,
    });
  };

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      requiredPrice,
    } = this.state;

    console.log('url', this.props.match);

    const items = [
      {
        header: `${requiredPrice} ETH`,
        meta: 'Required price (ETH)',
        description:
          'Price that property owner requires to sell his/her property',
      },
      {
        header: `${web3.utils.fromWei(balance, 'ether')} ETH`,
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend.',
      },
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: `${minimumContribution} Wei`,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver',
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers',
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have already donated to this campaign',
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    const { url, path } = this.props.match;
    const { address, viewRequests } = this.state;
    return (
      // <Layout>
      <div>
        <h3>Buy tokenized property!</h3>
        <br />

        <Grid>
          {viewRequests ? (
            <div>
              <div style={{ paddingBottom: '20px' }}>
                <Link
                  to={`${url}/campaigns/${address}/requests`}
                  onClick={this.onClickHandler}
                >
                  <i class='fa fa-arrow-left' aria-hidden='true'></i>
                </Link>
              </div>
              <Grid.Row>
                <Grid.Column>
                  <RequestIndex />
                </Grid.Column>
              </Grid.Row>
            </div>
          ) : (
            <div>
              <Link
                to={`${url}/campaigns/${address}/requests`}
                onClick={this.onClickHandler}
                className='mb-4'
              >
                View Requests
              </Link>

              <Grid.Row>
                <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

                <Grid.Column width={6}>
                  <ContributeForm address={address} />
                </Grid.Column>
              </Grid.Row>
            </div>
          )}
        </Grid>
      </div>
      //{' '}
      // </Layout>
    );
  }
}

export default withRouter(CampaignShow);
