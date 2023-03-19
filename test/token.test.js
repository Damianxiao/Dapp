import { tokens,EVM_REVERT } from '../helper.js'

//artifacts.require取到对应的合约，
const token = artifacts.require('Token')

//chai 取用chai的promised方法
require('chai').use(require('chai-as-promised'))
.should()
//传入合约对象，调用一个回调方法,从区块链上

// 取到合约上的public数据
contract('test',([deployer,receiver,exchange]) =>{
    var name  ="damian"
    var symbol ='dapp token'
    // var totalSupply ='1000000000000000000'
    var totalSupply = tokens(1000000)
    var decimals = '18'
    var Token
    //省去了每次都要new 一个token 的步骤 路由守卫
        beforeEach(async() =>{ 
            Token = await token.new() 
        })
        // 合约部署
        describe('合约部署变量检查', () => {
            it('项目名', async() =>{
                //从区块链上取数据都是异步进行的
                // 需要使用await，同时箭头函数前要加上async（） 代表异步
                // var Token = await token.new()
                var result= await Token.name()
                // result.equals('damian1')  报错，只能使用下面的
                result.should.equal(name)
                // console.log("result: "+ result)
            })
            it('代币名称', async() =>{
                var result= await Token.symbol()
                result.should.equal(symbol)
            })
            it('小数位数', async() =>{            
                var result= await Token.decimals()
                //should.equal总是用string进行比较运算
                result.toString().should.equal(decimals) 
            })
            it('总币量', async() =>{
                var result= await Token.totalSupply()            
                result.toString().should.equal(totalSupply.toString())
            })
            it('部署合约者代币总量', async() =>{
                var result = await Token.balanceOf(deployer)
                result.toString().should.equal(totalSupply.toString())
            })
        })
        // 转账
        describe('转账',async () =>{
            var amount  
            var balanceOf_d
            var balanceOf_r
            var result;
            beforeEach(async()=>{
                amount  = tokens(100)
                result = await Token.transfer(receiver,amount)
            })
            it('转移代币', async () =>{
               balanceOf_d=await Token.balanceOf(deployer)
               balanceOf_d.toString().should.equal(tokens(999900).toString())
               balanceOf_r=await Token.balanceOf(receiver)
               balanceOf_r.toString().should.equal(tokens(100).toString())
            })

            // it('转账监听',async() =>{
                    describe('success',async() =>{
                        it('转账emit transfer()', async() =>{
                            // console.log(result.logs)
                        // // console.log(result.logs.args)
                        var event = result.logs[0].event
                        event.toString().should.equal('Transfer')
                        var eventInfo = result.logs[0].args;
                        eventInfo.from.toString().should.equal(deployer,'from is correct')
                        eventInfo.to.toString().should.equal(receiver,'to is correct')
                        eventInfo.value.toString().should.equal(amount.toString(),'value is correct')
                        })
                    })
                    describe('failure', async() =>{
                // 转账失败的情况
                        it('转账reject by invalidAmount',async() => {

                        var invalidAmount = tokens(10000000000)
                        await Token.transfer(receiver,invalidAmount,{ from : deployer}).should.rejectedWith(EVM_REVERT)
                        // await Token.transfer(receiver,invalidAmount,{ from : deployer}).should.be.rejected
                        // console.log('balanceOf receiver : ' + Token.balanceOf[receiver])

                        // invalid recipent
                        // var invalidAmount = tokens(100)
                        // await Token.transfer(deployer,invalidAmount,{ from : receiver}).should.be.rejectedWith(EVM_REVERT)

                        })
                        // 无效的发送的地址
                        it('无效接受者地址', async() =>{
                            var invalidAmount = tokens(1)
                            // should be rejected 
                            await Token.transfer(0x0,tokens(1),{from : deployer}).should.rejected
                        })
                    })
            // })
        })
        // //approve tokens 
        describe('委托代币转移',()=> {
            let result
            var amount
            beforeEach(async () =>{
                amount = tokens(100)
                result = await Token.approve(exchange,amount,{from : deployer})
            })
            describe('success',  ()=>{
                // “allowance”是指以太坊账户所有者授权另一个账户或合约代表他们花费特定数量的Ether（以太坊网络的本地加密货币）。
                // beforeEach(async() =>{
                //     result = await Token.transferFrom(deployer, receiver, amount, { from: exchange })
                // })
                // it('transfeFrom tokens ', async() =>{
                //     var balanceOf = await Token.balanceOf(deployer)
                //     balanceOf.toString().should.equal(tokens(999900).toString())
                //     balanceOf = await Token.balanceOf(receiver)
                //     balanceOf.toString().should.equal(tokens(100).toString())
                // })
                // it('allowance : delegated token spending', async() => {
                //     const allowacne = await Token.allowance(deployer,exchange)
                //     // const allowacne = result.
                //     allowance.toString().should.be.equal(amount.toStirng())
                // })
                it('reset allowance', async() =>{
                    
                })
                it('emit approve()', async() =>{
                        var event = result.logs[0].event
                        event.toString().should.equal('Approval')
                        var eventInfo = result.logs[0].args
                        eventInfo.deployer.should.equal(deployer,'deployer is correct')
                        eventInfo.spender.should.equal(exchange,'spender is correct')
                        eventInfo.amount.toString().should.equal(amount.toString(),'amount is correct')
                })
            })
            describe('failed', async() =>{
                it('invalid spender address ', async()=>{
                    var amount = tokens(100)
                    await Token.approve(0x0,amount,{from : deployer}).should.be.rejected
                })
            })
        
        })











})

    
