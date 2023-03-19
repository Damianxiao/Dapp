pragma solidity ^0.5.0;


//deposit 需要使用token
import "./token.sol";

// 作为一个交易所，他应该具有什么功能？
// 1 存、取款
// 2 管理订单 - 指定或者取消
// 3 交易本身 要能够进行交易
// 4 交易所 要能够从中获取charge fee 

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange{
    //variables
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount,uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
    // 需要有哪些成员变量? 1 存什么token 指定ERC20规格的token种类， 2 存多少 3 放在哪 4 emit 5 更新余额
    function depositToken(address _token,uint256 _amount) public {
        //transferFrom 使用需要先approve 这点我们在test 中实现
        Token(_token).transferFrom(msg.sender,address(this),_amount);

    }
}
// Deposite  Ether 
