// src/components/TransferERC20.tsx
import React, { useState } from "react";
import {
  Button,
  Input,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { SimpleNFT as abi } from "abi/SimpleNFT";
import { Contract } from "ethers";
import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";

interface Props {
  addressContract: string;
  currentAccount: string | undefined;
}

declare let window: any;

export default function Mint(props: Props) {
  const addressContract = props.addressContract;
  const currentAccount = props.currentAccount;
  const [collection, setCollection] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("0");
  const [tokenUri, setTokenUri] = useState<string>("");

  async function mint(event: React.FormEvent) {
    event.preventDefault();
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract: Contract = new ethers.Contract(
      addressContract,
      abi,
      signer
    );

    contract
      .mint(collection, toAddress, parseUnits(tokenId, 18), tokenUri)
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`);
        tr.wait().then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        });
      })
      .catch((e: Error) => console.log(e));
  }

  const handleChangeTokenId = (tokenId: string) => setTokenId(tokenId);

  return (
    <form onSubmit={mint}>
      <FormControl>
        <FormLabel htmlFor="collection">Collection: </FormLabel>
        <Input
          id="collection"
          type="text"
          required
          onChange={(e) => setCollection(e.target.value)}
          my={3}
        />

        <FormLabel htmlFor="to_address">To address: </FormLabel>
        <Input
          id="to-address"
          type="text"
          required
          onChange={(e) => setToAddress(e.target.value)}
          my={3}
        />

        <FormLabel htmlFor="token_id">Token ID: </FormLabel>
        <NumberInput
          defaultValue={tokenId}
          min={0}
          max={1000000}
          onChange={handleChangeTokenId}
        >
          <NumberInputField />
        </NumberInput>

        <FormLabel htmlFor="token_uri">Token URI: </FormLabel>
        <Input
          id="token-uri"
          type="text"
          required
          onChange={(e) => setTokenUri(e.target.value)}
          my={3}
        />

        <Button type="submit" isDisabled={!currentAccount}>
          Mint a new NFT
        </Button>
      </FormControl>
    </form>
  );
}
