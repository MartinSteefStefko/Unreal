import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x228fbe2Cd541531FA8418276a4E7846ea9a2b579'
);

export default instance;
