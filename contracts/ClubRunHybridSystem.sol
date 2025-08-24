// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * 🎯 Club Run Hybrid System Smart Contract
 * 
 * This contract handles:
 * - Automated payments and escrow management
 * - Role-based access control on blockchain
 * - Revenue distribution to DJs, platform, partners
 * - Compliance and audit trails
 * - Integration with AI agents for seamless automation
 */

contract ClubRunHybridSystem is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant GUEST_ROLE = keccak256("GUEST_ROLE");
    bytes32 public constant DJ_ROLE = keccak256("DJ_ROLE");
    bytes32 public constant VERIFIED_DJ_ROLE = keccak256("VERIFIED_DJ_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");
    bytes32 public constant OPERATIONS_ROLE = keccak256("OPERATIONS_ROLE");
    bytes32 public constant PARTNER_ROLE = keccak256("PARTNER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AI_AGENT_ROLE = keccak256("AI_AGENT_ROLE");

    // Mission states
    enum MissionStatus {
        Created,
        Assigned,
        InProgress,
        Completed,
        Cancelled,
        Disputed
    }

    // Mission structure
    struct Mission {
        uint256 id;
        address client;
        address dj;
        uint256 amount;
        uint256 escrowAmount;
        MissionStatus status;
        uint256 createdAt;
        uint256 completedAt;
        string venue;
        string description;
        bool isP2P;
        uint256 platformFee;
        uint256 djPayout;
        uint256 partnerShare;
    }

    // User profile structure
    struct UserProfile {
        address userAddress;
        bytes32 role;
        uint256 rating;
        uint256 completedMissions;
        uint256 totalEarnings;
        bool isVerified;
        string metadata; // JSON string for additional data
    }

    // Events
    event MissionCreated(uint256 indexed missionId, address indexed client, uint256 amount);
    event MissionAssigned(uint256 indexed missionId, address indexed dj);
    event MissionCompleted(uint256 indexed missionId, address indexed dj, uint256 payout);
    event PaymentProcessed(uint256 indexed missionId, address indexed recipient, uint256 amount);
    event RoleAssigned(address indexed user, bytes32 role);
    event EscrowFunded(uint256 indexed missionId, uint256 amount);
    event EscrowReleased(uint256 indexed missionId, address indexed recipient, uint256 amount);

    // State variables
    Counters.Counter private _missionIds;
    mapping(uint256 => Mission) public missions;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256) public userBalances;
    
    // Platform configuration
    uint256 public platformFeePercentage = 5; // 5% platform fee
    uint256 public partnerSharePercentage = 2; // 2% partner share
    uint256 public minimumEscrowAmount = 0.01 ether;
    
    // AI Agent integration
    address public aiAgentAddress;
    mapping(bytes32 => bool) public aiAgentPermissions;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        // Set up AI agent permissions
        aiAgentPermissions[MissionStatus.Created] = true;
        aiAgentPermissions[MissionStatus.Assigned] = true;
        aiAgentPermissions[MissionStatus.Completed] = true;
    }

    /**
     * @dev Set AI agent address for automated operations
     */
    function setAIAgentAddress(address _aiAgentAddress) external onlyRole(ADMIN_ROLE) {
        aiAgentAddress = _aiAgentAddress;
        _grantRole(AI_AGENT_ROLE, _aiAgentAddress);
    }

    /**
     * @dev Create a new mission with automated escrow
     */
    function createMission(
        string memory _venue,
        string memory _description,
        bool _isP2P
    ) external payable onlyRole(CLIENT_ROLE) returns (uint256) {
        require(msg.value >= minimumEscrowAmount, "Insufficient escrow amount");
        
        _missionIds.increment();
        uint256 missionId = _missionIds.current();
        
        uint256 platformFee = (msg.value * platformFeePercentage) / 100;
        uint256 partnerShare = (msg.value * partnerSharePercentage) / 100;
        uint256 djPayout = msg.value - platformFee - partnerShare;
        
        missions[missionId] = Mission({
            id: missionId,
            client: msg.sender,
            dj: address(0),
            amount: msg.value,
            escrowAmount: msg.value,
            status: MissionStatus.Created,
            createdAt: block.timestamp,
            completedAt: 0,
            venue: _venue,
            description: _description,
            isP2P: _isP2P,
            platformFee: platformFee,
            djPayout: djPayout,
            partnerShare: partnerShare
        });

        emit MissionCreated(missionId, msg.sender, msg.value);
        emit EscrowFunded(missionId, msg.value);
        
        return missionId;
    }

    /**
     * @dev AI Agent can assign DJ to mission automatically
     */
    function assignDJToMission(uint256 _missionId, address _dj) 
        external 
        onlyRole(AI_AGENT_ROLE) 
        returns (bool) 
    {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Created, "Mission not available");
        require(hasRole(DJ_ROLE, _dj) || hasRole(VERIFIED_DJ_ROLE, _dj), "Invalid DJ address");
        
        mission.dj = _dj;
        mission.status = MissionStatus.Assigned;
        
        emit MissionAssigned(_missionId, _dj);
        return true;
    }

    /**
     * @dev Complete mission and release payments automatically
     */
    function completeMission(uint256 _missionId) 
        external 
        onlyRole(AI_AGENT_ROLE) 
        nonReentrant 
        returns (bool) 
    {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Assigned, "Mission not assigned");
        require(mission.dj != address(0), "No DJ assigned");
        
        mission.status = MissionStatus.Completed;
        mission.completedAt = block.timestamp;
        
        // Update DJ profile
        UserProfile storage djProfile = userProfiles[mission.dj];
        djProfile.completedMissions++;
        djProfile.totalEarnings += mission.djPayout;
        
        // Release payments
        _releasePayment(mission.dj, mission.djPayout);
        _releasePayment(address(this), mission.platformFee);
        
        // Partner share (if applicable)
        if (mission.partnerShare > 0) {
            _releasePayment(address(this), mission.partnerShare);
        }
        
        emit MissionCompleted(_missionId, mission.dj, mission.djPayout);
        return true;
    }

    /**
     * @dev Register user with role-based access
     */
    function registerUser(
        address _userAddress,
        bytes32 _role,
        string memory _metadata
    ) external onlyRole(ADMIN_ROLE) returns (bool) {
        require(_userAddress != address(0), "Invalid user address");
        
        userProfiles[_userAddress] = UserProfile({
            userAddress: _userAddress,
            role: _role,
            rating: 0,
            completedMissions: 0,
            totalEarnings: 0,
            isVerified: false,
            metadata: _metadata
        });
        
        _grantRole(_role, _userAddress);
        emit RoleAssigned(_userAddress, _role);
        
        return true;
    }

    /**
     * @dev AI Agent can update user verification status
     */
    function updateUserVerification(address _userAddress, bool _isVerified) 
        external 
        onlyRole(AI_AGENT_ROLE) 
        returns (bool) 
    {
        UserProfile storage profile = userProfiles[_userAddress];
        require(profile.userAddress != address(0), "User not found");
        
        profile.isVerified = _isVerified;
        
        // Auto-upgrade DJ to VERIFIED_DJ if verified
        if (_isVerified && hasRole(DJ_ROLE, _userAddress)) {
            _grantRole(VERIFIED_DJ_ROLE, _userAddress);
        }
        
        return true;
    }

    /**
     * @dev AI Agent can update user rating
     */
    function updateUserRating(address _userAddress, uint256 _rating) 
        external 
        onlyRole(AI_AGENT_ROLE) 
        returns (bool) 
    {
        require(_rating <= 5, "Rating must be 0-5");
        
        UserProfile storage profile = userProfiles[_userAddress];
        require(profile.userAddress != address(0), "User not found");
        
        profile.rating = _rating;
        return true;
    }

    /**
     * @dev Withdraw user balance
     */
    function withdrawBalance() external nonReentrant returns (bool) {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        return true;
    }

    /**
     * @dev Get mission details
     */
    function getMission(uint256 _missionId) external view returns (Mission memory) {
        return missions[_missionId];
    }

    /**
     * @dev Get user profile
     */
    function getUserProfile(address _userAddress) external view returns (UserProfile memory) {
        return userProfiles[_userAddress];
    }

    /**
     * @dev Get user balance
     */
    function getUserBalance(address _userAddress) external view returns (uint256) {
        return userBalances[_userAddress];
    }

    /**
     * @dev Check if user has specific role
     */
    function hasUserRole(address _userAddress, bytes32 _role) external view returns (bool) {
        return hasRole(_role, _userAddress);
    }

    /**
     * @dev Internal function to release payments
     */
    function _releasePayment(address _recipient, uint256 _amount) internal {
        require(_amount > 0, "Invalid payment amount");
        
        if (_recipient == address(this)) {
            // Platform fee or partner share
            userBalances[address(this)] += _amount;
        } else {
            // DJ payout
            userBalances[_recipient] += _amount;
        }
        
        emit PaymentProcessed(0, _recipient, _amount);
    }

    /**
     * @dev Emergency function to cancel mission (admin only)
     */
    function emergencyCancelMission(uint256 _missionId) 
        external 
        onlyRole(ADMIN_ROLE) 
        nonReentrant 
        returns (bool) 
    {
        Mission storage mission = missions[_missionId];
        require(mission.status != MissionStatus.Completed, "Mission already completed");
        
        mission.status = MissionStatus.Cancelled;
        
        // Refund client
        if (mission.escrowAmount > 0) {
            (bool success, ) = payable(mission.client).call{value: mission.escrowAmount}("");
            require(success, "Refund failed");
            
            mission.escrowAmount = 0;
        }
        
        return true;
    }

    /**
     * @dev Update platform configuration (admin only)
     */
    function updatePlatformConfig(
        uint256 _platformFeePercentage,
        uint256 _partnerSharePercentage,
        uint256 _minimumEscrowAmount
    ) external onlyRole(ADMIN_ROLE) returns (bool) {
        require(_platformFeePercentage + _partnerSharePercentage <= 20, "Total fees too high");
        require(_minimumEscrowAmount > 0, "Invalid minimum escrow");
        
        platformFeePercentage = _platformFeePercentage;
        partnerSharePercentage = _partnerSharePercentage;
        minimumEscrowAmount = _minimumEscrowAmount;
        
        return true;
    }

    /**
     * @dev Withdraw platform fees (admin only)
     */
    function withdrawPlatformFees() external onlyRole(ADMIN_ROLE) nonReentrant returns (bool) {
        uint256 balance = userBalances[address(this)];
        require(balance > 0, "No platform fees to withdraw");
        
        userBalances[address(this)] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        return true;
    }

    // Receive function for contract to accept ETH
    receive() external payable {}
}
