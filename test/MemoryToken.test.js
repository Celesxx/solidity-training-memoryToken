const { assert } = require('chai')

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => 
{
  let token

  before(async() => 
  {
    token = await MemoryToken.deployed()
  })

  describe("deployement", async() => 
  {
    it("deploy sucessfully", async() => 
    {
      const address = token.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })


    it("has a name", async() => 
    {
      const name = await token.name()
      assert.equal(name, "Memory Token")
    })


    it("has a symbol", async() => 
    {
      const name = await token.symbol()
      assert.equal(name, "MEMORY")
    })

  })


  describe("token distribution", async() => 
  {
    let result
    it("mints tokens", async() => 
    {
      await token.mint(accounts[0], 'https://www.token-url.com/nft')

      // ajout +1 au total supply
      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'total supply is correct')

      // ajoute +1 à la balance du propriétaire
      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is correct')

      // vérifie que c'est le bon propriétaire
      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct')
      result = await token.tokenOfOwnerByIndex(accounts[0],0)


      // Afficher touts les tokens de l'owner
      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for(let i = 0; i < balanceOf; i++)
      {
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        tokenIds.push(id.toString())
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')

      // token url est correct 
      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI, 'https://www.token-url.com/nft')
    })
  })


})
