pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// 根据ERC20 的代币发行标准，一个token必须具有
// name decimals supply symbol 等数据
contract Token{
    string public name ="damian";
    string public symbol  = "dapp token";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    using SafeMath for uint; //调用openZepplin的安全算术运算库。


    // 将转账事件进行监听，indexed？
    event  Transfer(address indexed from,address to,uint256 value);

    // approve
    event Approval(address deployer,address spender,uint256 amount);

    //Track balances 账户余额
    //使用mapping的映射，地址指向一个余额，代表这个地址的账户余额。
    mapping (address => uint256) public balanceOf;

    //allowance
    mapping(address => mapping(address => uint256)) private allowance;


    //send token 交易代币

    constructor() public {
        totalSupply = 1000000 *(10 ** decimals);
        // totalSupply = n;
        //msg sender就是调用这个方法的用户，在这个构造函数的例子中，sender就是发布这个合约的人
        balanceOf[msg.sender] = totalSupply; 
    }


    function transfer(address  _to,uint256 _value ) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender,_to,_value);
        return true;
    }
    // 为transfer 提供一个内部函数，也就是token转移的核心代码，它能够重复使用
    function _transfer (address _from, address _to,uint256 _value) internal {
        require(_to != address(0));
        balanceOf[msg.sender]=balanceOf[msg.sender].sub(_value);//转账者扣款
        balanceOf[_to]=balanceOf[_to].add(_value);
        //为什么不用直接的加减运算符？在区块链以太坊网络中，直接进行运算是容易导致内存的溢出，在这里调用openzepplin的安全运算库。
        // balanceOf[msg.sender]-=_value;//转账者扣款
        // balanceOf[_to])+=_value;
        emit Transfer(_from,_to,_value);
    }
    // allowance

    // approve tokens 当把tokens 给交易所实际上是把这些代币使用权交给交易所，而避免交易所捐款跑路
    function approve(address spender, uint256 amount) public returns (bool success) {
        require(spender != address(0));
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // transfer from 当这部分代币 sender 批准了，exchange会调用 transferFrom这个专有方法使用这部分token
    function transferFrom(address from,address to,uint256 value) public returns(bool success){
        require(value <=balanceOf[from]);  
        require(value <=allowance[from][msg.sender]);// 转账的金额不能超过deployer的余额，并且不能超过approve的总值
        //这个方法是exchange调用，故[from（这里的from是deployer][msg.sender 是deployer approve的exchange]
        allowance[from][msg.sender]  = allowance[from][msg.sender].sub(value);
        _transfer(from,to,value);
        return true;
    }



}
