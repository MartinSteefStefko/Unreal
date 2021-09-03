import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xfA8653BEfe561C019a8B5c1e8396da68b86E3850'
);

export default instance;
