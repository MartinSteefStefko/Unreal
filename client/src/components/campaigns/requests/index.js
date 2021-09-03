import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
// import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../RequestRow/RequestRow';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <div>
        <h3>Requests</h3>
        <Link to={`/campaigns/${this.props.address}/requests/new`}>
          <p className='text-purple'>Add Request</p>
        </Link>
        <Table size='small' basic='very'>
          <Header>
            <Row>
              {/* <HeaderCell>ID</HeaderCell> */}
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          {/* <Body>{this.renderRows()}</Body> */}
        </Table>
        {/* <div>Found {this.props.requestCount} requests.</div> */}
      </div>
    );
  }
}

export default RequestIndex;
