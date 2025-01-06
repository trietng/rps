//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Reference:
// https://github.com/ratelang/ratel/blob/master/examples/masked_messages.vy
contract InputMaskManager {
    struct InputMask {
        address claimant; 
        bool isUsed;     
        bytes32 maskedInput; 
    }

    mapping(uint256 => InputMask) public inputMasks; 
    uint256 public totalMasks; 
    uint256 public usedMasks; 

    event MaskReserved(address indexed client, uint256 maskId);
    event MaskSubmitted(address indexed client, uint256 maskId, bytes32 maskedInput);

    function createInputMasks(uint256 count) private{
        for (uint256 i = 0; i < count; i++) {
            inputMasks[totalMasks] = InputMask({
                claimant: address(0),
                isUsed: false,
                maskedInput: bytes32(0)
            });
            totalMasks++;
        }
    }

    constructor(uint256 count) {
        createInputMasks(count);
    }

    function reserveMask() public returns (uint256) {
        require(usedMasks < totalMasks, "No available input masks");
        for (uint256 i = 0; i < totalMasks; i++) {
            if (inputMasks[i].claimant == address(0) && !inputMasks[i].isUsed) {
                inputMasks[i].claimant = msg.sender;
                emit MaskReserved(msg.sender, i);
                return i;
            }
        }
        revert("No available input masks");
    }

    function submitMaskedInput(uint256 maskId, bytes32 maskedInput) public {
        require(inputMasks[maskId].claimant == msg.sender, "Not authorized for this mask");
        require(!inputMasks[maskId].isUsed, "Mask already used");

        inputMasks[maskId].isUsed = true;
        inputMasks[maskId].maskedInput = maskedInput;
        usedMasks++;

        emit MaskSubmitted(msg.sender, maskId, maskedInput);
    }

    function getMaskedInput(uint256 maskId) public view returns (bytes32) {
        require(inputMasks[maskId].claimant == msg.sender, "Not authorized to access this input");
        return inputMasks[maskId].maskedInput;
    }

    function validateMaskedInput(uint256 maskId, bytes32 expectedMaskedInput) public view returns (bool) {
        require(inputMasks[maskId].claimant == msg.sender, "Not authorized to validate this input");
        return inputMasks[maskId].maskedInput == expectedMaskedInput;
    }
}
