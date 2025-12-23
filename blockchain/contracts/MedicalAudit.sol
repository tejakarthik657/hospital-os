// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MedicalAudit
 * @dev Implements a tamper-proof registry for AI-generated medical summaries.
 */
contract MedicalAudit {
    struct AuditTrail {
        bytes32 recordHash; // The SHA-256 fingerprint
        uint256 timestamp;  // Block time when signed
        address doctor;     // The wallet address of the doctor who approved it
    }

    // Mapping: RecordID (e.g., MongoDB ID) -> Blockchain Audit Data
    mapping(string => AuditTrail) public registry;

    // Event for the Backend to listen to (Phase 1)
    event RecordSigned(string indexed recordId, bytes32 hash, address doctor);

    /**
     * @dev Saves a record fingerprint to the blockchain.
     * This creates the "signed" status seen in Image 11.
     */
    function signRecord(string memory _recordId, bytes32 _hash) public {
        // Prevent overwriting to ensure true immutability
        require(registry[_recordId].timestamp == 0, "Record already signed on-chain");

        registry[_recordId] = AuditTrail({
            recordHash: _hash,
            timestamp: block.timestamp,
            doctor: msg.sender
        });

        emit RecordSigned(_recordId, _hash, msg.sender);
    }

    /**
     * @dev Returns the hash of a record to verify integrity in Image 14.
     */
    function verifyRecord(string memory _recordId) public view returns (bytes32) {
        return registry[_recordId].recordHash;
    }
}