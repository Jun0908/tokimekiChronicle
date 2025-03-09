// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC7007Zkml.sol";
import "./IERC7007Enumerable.sol";

/**
 * @dev Implementation of the {IERC7007Enumerable} interface.
 */
abstract contract ERC7007Enumerable is ERC7007Zkml, IERC7007Enumerable {
    /**
     * @dev See {IERC7007Enumerable-tokenId}.
     */
    mapping(uint256 => string) public prompt;

    /**
     * @dev See {IERC7007Enumerable-prompt}.
     */
    mapping(bytes => uint256) public tokenId;

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC7007Zkml, IERC165) returns (bool) {
        return
            interfaceId == type(IERC7007Enumerable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Explicitly override `addAigcData` to resolve conflict.
     */
    function addAigcData(
        uint256 tokenId_,
        bytes calldata prompt_,
        bytes calldata aigcData_,
        bytes calldata proof_
    ) public virtual override(IERC7007, ERC7007Zkml) {
        ERC7007Zkml.addAigcData(tokenId_, prompt_, aigcData_, proof_);
    }

    /**
     * @dev Explicitly override `verify` to resolve conflict.
     */
    function verify(
        bytes calldata prompt_,
        bytes calldata aigcData_,
        bytes calldata proof_
    ) public view virtual override(IERC7007, ERC7007Zkml) returns (bool) {
        return ERC7007Zkml.verify(prompt_, aigcData_, proof_);
    }

    /**
     * @dev Mint a token and store its data.
     */
    function mint(
        address to,
        bytes calldata prompt_,
        bytes calldata aigcData,
        string calldata uri,
        bytes calldata proof
    ) public virtual override returns (uint256 tokenId_) {
        tokenId_ = ERC7007Zkml.mint(to, prompt_, aigcData, uri, proof);
        prompt[tokenId_] = string(prompt_);
        tokenId[prompt_] = tokenId_;
    }
}

  /**
contract MockERC7007Enumerable is ERC7007Enumerable {
    constructor(
        string memory name_,
        string memory symbol_,
        address verifier_
    ) ERC7007Zkml(name_, symbol_, verifier_) {}
}
*/
