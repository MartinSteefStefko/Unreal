import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import { Button } from 'reactstrap';
// import Layout from '../../components/';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm/ContributeForm';
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
  };

  // const match = useRouteMatch();
  // const params = useParams();

  // const { quoteId } = params;

  async componentDidMount() {
    // const address = this.props.match.params.campaignAddress;
    // const campaign = Campaign(address);
    // const summary = await campaign.methods.getSummary().call();
    // this.setState({
    //   address: address,
    //   minimumContribution: summary[0],
    //   balance: summary[1],
    //   requestsCount: summary[2],
    //   approversCount: summary[3],
    //   manager: summary[4],
    // });
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = this.state;

    console.log('url', this.props.match);

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
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
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend.',
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    const { url, path } = this.props.match;
    const { address } = this.state;
    return (
      // <Layout>
      <div>
        <h3>Buy event</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              {/* this will be nested route */}
              {/* this path part must exactly by campaigns/${state.address} in the url */}
              <Route path={path} exact>
                {/* this wont be necessary  campaigns/${state.address} if it is already inside url*/}
                {/* <Link to={`${match.url}/requests`}> */}
                <Link to={`${url}/campaigns/${address}/requests`}>
                  <a>
                    <Button className='btn-purple' primary>
                      View Requests
                    </Button>
                  </a>
                </Link>
              </Route>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={address} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      // </Layout>
    );
  }
}

export default withRouter(CampaignShow);
