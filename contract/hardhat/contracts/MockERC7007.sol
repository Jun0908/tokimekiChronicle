// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol"; 
import "./IERC7007.sol";

/**
 * @title MockERC7007
 * @dev A mock implementation of ERC7007 that extends ERC721 and supports AIGC data handling.
 */
contract MockERC7007 is IERC721, ERC165, IERC7007 {
    struct AIGCData {
        bytes prompt;
        bytes aigcData;
        bytes proof;
    }

    // Mapping to store AIGC data for each token ID
    mapping(uint256 => AIGCData) private _aigcDataMapping;

    /**
     * @dev Adds AIGC data to a specific token.
     * @param tokenId The token ID.
     * @param prompt The user's prompt.
     * @param aigcData The AI-generated content data.
     * @param proof The proof for verification.
     */
    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external override {
        _aigcDataMapping[tokenId] = AIGCData(prompt, aigcData, proof);
        emit AigcData(tokenId, prompt, aigcData, proof); 
    }

    /**
     * @dev Verifies the provided AIGC data with the proof.
     * @param prompt The user's prompt.
     * @param aigcData The AI-generated content data.
     * @param proof The proof for verification.
     * @return success Always returns true (mock implementation).
     */
    function verify(
        bytes calldata, // Unused parameter removed
        bytes calldata, // Unused parameter removed
        bytes calldata  // Unused parameter removed
    ) external pure override returns (bool success) {
        return true; // Mock verification always returns true
    }

    /**
     * @dev Retrieves the AIGC data for a given token ID.
     * @param tokenId The token ID.
     * @return prompt The stored prompt.
     * @return aigcData The stored AIGC data.
     * @return proof The stored proof.
     */
    function getAigcData(uint256 tokenId)
        public
        view
        returns (bytes memory prompt, bytes memory aigcData, bytes memory proof)
    {
        AIGCData storage data = _aigcDataMapping[tokenId];
        return (data.prompt, data.aigcData, data.proof);
    }

    /**
     * @dev Checks if a given interface is supported.
     * @param interfaceId The interface ID to check.
     * @return Returns true if the interface is supported.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC7007).interfaceId || 
            interfaceId == type(IERC721).interfaceId || 
            super.supportsInterface(interfaceId);
    }

    // =========================================
    // Placeholder ERC721 functions
    // =========================================

    function balanceOf(address) external pure override returns (uint256) {
        return 0;
    }

    function ownerOf(uint256) external pure override returns (address) {
        return address(0); 
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) external pure override {}

    function safeTransferFrom(
        address,
        address,
        uint256
    ) external pure override {}

    function transferFrom(
        address,
        address,
        uint256
    ) external pure override {}

    function approve(address, uint256) external pure override {}

    function setApprovalForAll(address, bool) external pure override {}

    function getApproved(uint256) external pure override returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address) external pure override returns (bool) {
        return false; 
    }
}
