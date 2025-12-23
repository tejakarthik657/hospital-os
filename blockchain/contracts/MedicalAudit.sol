// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalAudit {
    struct AuditTrail {
        bytes32 recordHash; // SHA-256 fingerprint
        uint256 timestamp;  // When it was signed
        address doctor;     // Wallet address of the signer
    }

    // Mapping: RecordID (String) -> AuditTrail Data
    mapping(string => AuditTrail) public registry;

    event RecordSigned(string indexed recordId, bytes32 hash, address doctor);

    // Function to "Lock" a record's integrity
    function signRecord(string memory _recordId, bytes32 _hash) public {
        registry[_recordId] = AuditTrail({
            recordHash: _hash,
            timestamp: block.timestamp,
            doctor: msg.sender
        });

        emit RecordSigned(_recordId, _hash, msg.sender);
    }

    // Function to verify if data matches the ledger
    function getRecordHash(string memory _recordId) public view returns (bytes32) {
        return registry[_recordId].recordHash;
    }
}