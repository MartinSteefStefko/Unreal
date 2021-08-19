import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
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
    address: '',
    minimumContribution: 0,
    balance: 0,
    requestsCount: 0,
    approversCount: 0,
    manager: '',
  };

  // const match = useRouteMatch();
  // const params = useParams();

  // const { quoteId } = params;

  async componentDidMount() {
    const address = this.props.match.params.campaignAddress;
    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    this.setState({
      address: address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    });
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = this.state;

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
    const { match } = this.props;
    const { state } = this.state;
    return (
      // <Layout>
      <div>
        <h3>Campaign Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={state.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              {/* this will be nested route */}
              <Route path={match.path} exact>
                <Link to={`${match.url}/campaigns/${state.address}/requests`}>
                  <a>
                    <Button primary>View Requests</Button>
                  </a>
                </Link>
              </Route>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      // </Layout>
    );
  }
}

export default withRouter(CampaignShow);
