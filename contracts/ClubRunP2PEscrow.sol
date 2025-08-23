// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClubRunP2PEscrow is ReentrancyGuard, Ownable {
    
    enum PaymentType { CRYPTO_NATIVE, CRYPTO_TOKEN, FIAT_RESERVE }
    enum MissionStatus { OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, DISPUTED, CANCELLED }
    
    struct Mission {
        bytes32 id;
        address curator;
        address runner;
        uint256 budget;
        PaymentType paymentType;
        address tokenAddress; // For ERC20 tokens (USDC, etc.)
        uint256 escrowAmount;
        MissionStatus status;
        uint256 createdAt;
        uint256 deadline;
        string ipfsHash; // Mission details stored on IPFS
        bool runnerProofSubmitted;
        bool curatorApproved;
        string fiatReference; // For Web2 payment integration
    }
    
    struct PaymentMethod {
        PaymentType paymentType;
        address tokenAddress;
        uint256 amount;
        string fiatReference; // For Web2 payment integration
    }
    
    mapping(bytes32 => Mission) public missions;
    mapping(bytes32 => PaymentMethod) public paymentMethods;
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public userReputation;
    
    // Platform fees (configurable)
    uint256 public platformFeePercent = 25; // 0.25% (25 basis points)
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Events for decentralized listening
    event MissionCreated(bytes32 indexed missionId, address indexed curator, uint256 budget, PaymentType paymentType);
    event MissionAssigned(bytes32 indexed missionId, address indexed runner);
    event ProofSubmitted(bytes32 indexed missionId, string proofHash);
    event PaymentReleased(bytes32 indexed missionId, address indexed runner, uint256 amount);
    event DisputeRaised(bytes32 indexed missionId, address indexed disputant);
    event MissionCancelled(bytes32 indexed missionId, address indexed curator);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    
    modifier onlyParticipant(bytes32 missionId) {
        require(
            msg.sender == missions[missionId].curator || 
            msg.sender == missions[missionId].runner,
            "Not authorized"
        );
        _;
    }
    
    modifier onlyCurator(bytes32 missionId) {
        require(msg.sender == missions[missionId].curator, "Only curator can perform this action");
        _;
    }
    
    modifier onlyRunner(bytes32 missionId) {
        require(msg.sender == missions[missionId].runner, "Only assigned runner can perform this action");
        _;
    }
    
    /**
     * @dev Create mission with escrow (supports multiple payment types)
     */
    function createMission(
        bytes32 missionId,
        uint256 budget,
        PaymentType paymentType,
        address tokenAddress,
        uint256 deadline,
        string memory ipfsHash,
        string memory fiatReference
    ) external payable nonReentrant {
        require(missions[missionId].curator == address(0), "Mission already exists");
        require(budget > 0, "Budget must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");
        
        uint256 escrowAmount = 0;
        
        if (paymentType == PaymentType.CRYPTO_NATIVE) {
            // Native crypto (MATIC on Polygon)
            require(msg.value == budget, "Must send exact budget amount");
            escrowAmount = msg.value;
        } else if (paymentType == PaymentType.CRYPTO_TOKEN) {
            // ERC20 tokens (USDC, USDT, etc.)
            require(tokenAddress != address(0), "Token address required");
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), budget);
            escrowAmount = budget;
        } else if (paymentType == PaymentType.FIAT_RESERVE) {
            // Fiat payments handled off-chain, small gas deposit
            require(msg.value >= 0.001 ether, "Minimum gas deposit required");
            escrowAmount = msg.value; // Just for gas fees
        }
        
        missions[missionId] = Mission({
            id: missionId,
            curator: msg.sender,
            runner: address(0),
            budget: budget,
            paymentType: paymentType,
            tokenAddress: tokenAddress,
            escrowAmount: escrowAmount,
            status: MissionStatus.OPEN,
            createdAt: block.timestamp,
            deadline: deadline,
            ipfsHash: ipfsHash,
            runnerProofSubmitted: false,
            curatorApproved: false,
            fiatReference: fiatReference
        });
        
        paymentMethods[missionId] = PaymentMethod({
            paymentType: paymentType,
            tokenAddress: tokenAddress,
            amount: budget,
            fiatReference: fiatReference
        });
        
        emit MissionCreated(missionId, msg.sender, budget, paymentType);
    }
    
    /**
     * @dev Runner accepts mission (P2P assignment)
     */
    function acceptMission(bytes32 missionId) external {
        Mission storage mission = missions[missionId];
        require(mission.status == MissionStatus.OPEN, "Mission not available");
        require(mission.curator != msg.sender, "Cannot accept own mission");
        require(block.timestamp <= mission.deadline, "Mission expired");
        
        mission.runner = msg.sender;
        mission.status = MissionStatus.ASSIGNED;
        
        emit MissionAssigned(missionId, msg.sender);
    }
    
    /**
     * @dev Runner submits proof of completion
     */
    function submitProof(bytes32 missionId, string memory proofHash) external onlyRunner(missionId) {
        Mission storage mission = missions[missionId];
        require(mission.status == MissionStatus.ASSIGNED, "Invalid mission status");
        
        mission.runnerProofSubmitted = true;
        mission.status = MissionStatus.IN_PROGRESS;
        
        emit ProofSubmitted(missionId, proofHash);
    }
    
    /**
     * @dev Curator approves work and releases payment
     */
    function approveAndRelease(bytes32 missionId) external onlyCurator(missionId) nonReentrant {
        Mission storage mission = missions[missionId];
        require(mission.runnerProofSubmitted, "No proof submitted");
        require(mission.status == MissionStatus.IN_PROGRESS, "Invalid status");
        
        mission.curatorApproved = true;
        mission.status = MissionStatus.COMPLETED;
        
        _releasePayment(missionId);
        _updateReputation(mission.runner, true);
    }
    
    /**
     * @dev Curator can cancel mission if not yet assigned
     */
    function cancelMission(bytes32 missionId) external onlyCurator(missionId) nonReentrant {
        Mission storage mission = missions[missionId];
        require(mission.status == MissionStatus.OPEN, "Cannot cancel assigned mission");
        
        mission.status = MissionStatus.CANCELLED;
        
        // Return escrow to curator
        if (mission.paymentType == PaymentType.CRYPTO_NATIVE) {
            payable(mission.curator).transfer(mission.escrowAmount);
        } else if (mission.paymentType == PaymentType.CRYPTO_TOKEN) {
            IERC20(mission.tokenAddress).transfer(mission.curator, mission.budget);
        } else if (mission.paymentType == PaymentType.FIAT_RESERVE) {
            payable(mission.curator).transfer(mission.escrowAmount);
        }
        
        emit MissionCancelled(missionId, msg.sender);
    }
    
    /**
     * @dev Internal payment release (supports multiple payment types)
     */
    function _releasePayment(bytes32 missionId) internal {
        Mission storage mission = missions[missionId];
        PaymentMethod memory payment = paymentMethods[missionId];
        
        uint256 platformFee = (payment.amount * platformFeePercent) / FEE_DENOMINATOR;
        uint256 runnerAmount = payment.amount - platformFee;
        
        if (payment.paymentType == PaymentType.CRYPTO_NATIVE) {
            // Release native crypto
            payable(mission.runner).transfer(runnerAmount);
            payable(owner()).transfer(platformFee);
        } else if (payment.paymentType == PaymentType.CRYPTO_TOKEN) {
            // Release ERC20 tokens
            IERC20(payment.tokenAddress).transfer(mission.runner, runnerAmount);
            IERC20(payment.tokenAddress).transfer(owner(), platformFee);
        } else if (payment.paymentType == PaymentType.FIAT_RESERVE) {
            // Trigger off-chain fiat payment (event for backend to process)
            // Gas deposit returned to curator
            payable(mission.curator).transfer(mission.escrowAmount);
        }
        
        emit PaymentReleased(missionId, mission.runner, runnerAmount);
    }
    
    /**
     * @dev Raise dispute (requires arbitration)
     */
    function raiseDispute(bytes32 missionId) external onlyParticipant(missionId) {
        Mission storage mission = missions[missionId];
        require(mission.status != MissionStatus.COMPLETED, "Mission already completed");
        require(mission.status != MissionStatus.CANCELLED, "Mission already cancelled");
        
        mission.status = MissionStatus.DISPUTED;
        emit DisputeRaised(missionId, msg.sender);
    }
    
    /**
     * @dev Update user reputation
     */
    function _updateReputation(address user, bool success) internal {
        if (success) {
            userReputation[user] += 10;
        } else {
            userReputation[user] = userReputation[user] > 5 ? userReputation[user] - 5 : 0;
        }
        emit ReputationUpdated(user, userReputation[user]);
    }
    
    /**
     * @dev Get mission details
     */
    function getMission(bytes32 missionId) external view returns (Mission memory) {
        return missions[missionId];
    }
    
    /**
     * @dev Get user reputation
     */
    function getUserReputation(address user) external view returns (uint256) {
        return userReputation[user];
    }
    
    /**
     * @dev Update platform fee (owner only)
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 500, "Fee cannot exceed 5%");
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Emergency token withdrawal (owner only)
     */
    function emergencyWithdrawToken(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(owner(), balance);
    }
}
