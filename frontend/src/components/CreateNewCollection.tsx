// src/components/TransferERC20.tsx
import React, { useState } from 'react'
import { Button, Input , NumberInput,  NumberInputField,  FormControl,  FormLabel } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { SimpleNFT as abi } from 'abi/SimpleNFT'
import { Contract } from "ethers"
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider"

interface Props {
    addressContract: string,
    currentAccount: string | undefined
}

declare let window: any;

export default function CreateNewCollection(props: Props) {
  const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const [collection, setCollection] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [symbol, setSymbol] = useState<string>("")

  async function createNewCollection(event:React.FormEvent) {
    event.preventDefault()
    if(!window.ethereum) return    
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract: Contract = new ethers.Contract(addressContract, abi, signer)
    
    contract.createNewCollection(collection, name, symbol)
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt: TransactionReceipt)=>{ console.log("transfer receipt", receipt) })
      })
      .catch((e:Error)=>console.log(e))
  }

  return (
    <form onSubmit={createNewCollection}>
    <FormControl>
      <FormLabel htmlFor='collection'>Collection: </FormLabel>
      <Input id="collection" type="text" required  onChange={(e) => setCollection(e.target.value)} my={3}/>

      <FormLabel htmlFor='name'>Name: </FormLabel>
      <Input id="name" type="text" required  onChange={(e) => setName(e.target.value)} my={3}/>

      <FormLabel htmlFor='symbol'>Symbol: </FormLabel>
      <Input id="symbol" type="text" required  onChange={(e) => setSymbol(e.target.value)} my={3}/>

      <Button type="submit" isDisabled={!currentAccount}>Create a new NFT collection</Button>
    </FormControl>
    </form>
  )
}
