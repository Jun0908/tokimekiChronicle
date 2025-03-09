// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC7007Enumerable.sol";

/**
 * @dev Concrete implementation of ERC7007Enumerable for testing and deployment.
 */
contract MockERC7007Enumerable is ERC7007Enumerable {
    constructor(
        string memory name_,
        string memory symbol_,
        address verifier_
    ) ERC7007Zkml(name_, symbol_, verifier_) {}
}