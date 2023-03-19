import { tokens,EVM_REVERT } from '../helper.js'



//artifacts.require取到对应的合约，
const Exchange = artifacts.require('Exchange')
const Token = artifacts.require('Token')

//chai 取用chai的promised方法
require('chai').use(require('chai-as-promised'))
.should()
//传入合约对象，调用一个回调方法,从区块链上

// feeAccount是交易所的交易费用存放账户
contract('test',([deployer,feeAccount,user1]) =>{
    var exchange
    var feePercent = 10 
    var token

    //实例化,调用合约构造函数
    beforeEach(async() =>{
        // exchange = await Exchange.new()
        exchange = await Exchange.new(feeAccount,feePercent)
        token = await Token.new()
        // user1 里没有token
        await token.transfer(user1,tokens(100),{from : deployer})
    })
    describe('user1 ',()=>{
        it('user1 提款 100',async()=>{
            var balance = await token.balanceOf(user1)
            balance.toString().should.equal(tokens(100).toString())
        }) 
    })
        
    describe('交易所变量检查',() =>{
        it('交易feeAccount',async()=>{
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })
        it('交易feePercent', async() =>{
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    })

    describe('存入代币depositToken', ()=>{
        var amount = tokens(100)
        beforeEach(async()=>{
            // user1 approve Exchange存入tokens进exchange
            await token.approve(exchange.address,amount,{from : user1})
            const result = await exchange.depositToken(token.address,amount,{from : user1 })
        })

        describe('success',()=>{
            it('存款余额',async()=>{
                //确认有没有存进去
                var balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
            })
        })

        describe('failure',()=>{

        })
    })
})


    
