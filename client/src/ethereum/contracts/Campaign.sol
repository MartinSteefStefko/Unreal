pragma solidity ^0.4.21;

contract CampaignFactory {
    address[] public deployedCampaigns;
    event campaignDeployed (address campaignAddress);

    function createCampaign(uint minimum, uint campaignLimit, string propertyId) public {
        address newCampaign = new Campaign(minimum, msg.sender, campaignLimit, propertyId );
        deployedCampaigns.push(newCampaign);
        emit campaignDeployed(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
        
    }

    Request[] public requests;
    mapping (string => address) propertyReferences;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public campaignLimit;
    string public propertyId;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator, uint limit, string id) public {
        manager = creator;
        minimumContribution = minimum;
        campaignLimit = limit;
        propertyId = id;
        propertyReferences[propertyId]=address(this);
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        require(msg.value <= campaignLimit);
        require(address(this).balance <= campaignLimit);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address, uint, string
      ) {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager,
          campaignLimit,
          propertyId
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
    function getAddressFromPropertyId(string propertyId) public view returns(address){
        return( propertyReferences[propertyId]);
        
    }
}