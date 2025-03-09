// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UniversalSender {
    // このコントラクトがETHを受け取れるようにする
    receive() external payable {}

    /// @notice 指定された量のETHを送信する
    /// @param recipient 送信先のアドレス
    /// @param amount 送信するETHの量（wei単位）
    /// @dev トランザクション時にmsg.valueとして、少なくともamountのETHを送付する必要があります。
    function sendETH(address payable recipient, uint256 amount) public payable {
        require(msg.value >= amount, "Insufficient ETH sent");
        recipient.transfer(amount);
        if (msg.value > amount) {
            payable(msg.sender).transfer(msg.value - amount);
        }
    }

    /// @notice 指定された量のERC20トークンを送信する（低レベル呼び出しを使用）
    /// @param token ERC20トークンコントラクトのアドレス
    /// @param recipient 送信先のアドレス
    /// @param amount 送信するトークンの量
    /// @dev 呼び出し元は、あらかじめtokenコントラクトのapproveを実行して、このコントラクトに必要なトークンの転送を許可しておく必要があります。
    function sendToken(address token, address recipient, uint256 amount) public returns (bool) {
        (bool success, ) = token.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, recipient, amount)
        );
        require(success, "Token transfer failed");
        return success;
    }
}
