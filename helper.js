// token decimal转换计算
// 加上export
export const tokens = (n) =>{
    return new web3.utils.BN( // web3.js提供的BN 大整数运算方法
            web3.utils.toWei(n.toString(),'ether') // 格式化suppply ehter 的小数位数也是18位，故这里使用ether 没有问题
    )
}

// define a  exception info : invalidAmoumt
export const EVM_REVERT = 'VM Exception while processing transaction: revert'


//define a exception  : invalidRecipent

