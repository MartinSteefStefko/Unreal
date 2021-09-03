import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import { Form, Input, Message } from 'semantic-ui-react';
import ClipLoader from 'react-spinners/ClipLoader';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
// import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    console.log('this.props.address', this.props.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });
      this.setState({ loading: false, value: '' });
      this.props.history.push(`/property/${this.props.match.params.id}`);

      // Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Amount to Buy</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
              label='ether'
              labelPosition='right'
              placeholder={`max. ${'propertyPriceAtCreation.ethereum'}`}
            />
          </Form.Field>
          <Message
            error
            header='Oops!'
            style={{ maxWidth: '300px' }}
            content={this.state.errorMessage}
          />

          <Button className='btn-purple ' size='lg' block>
            {this.state.loading ? (
              <div style={{ height: '' }}>
                <ClipLoader size={19} color={'#ffffff'}></ClipLoader>
                {/* Preparing Files */}
              </div>
            ) : (
              'Buy!'
            )}
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(ContributeForm);
