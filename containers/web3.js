import {
  Zora,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
  constructBidShares,
} from "@zoralabs/zdk"; // Zora provider
import axios from "axios"; // axios requests
import Web3Modal from "web3modal"; // Web3Modal
import { providers } from "ethers"; // Ethers
import { useState, useEffect } from "react"; // State management
import { createContainer } from "unstated-next"; // Unstated-next containerization
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)

// Web3Modal provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Inject Infura
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

function useWeb3() {
  const [zora, setZora] = useState(null); // Zora provider
  const [modal, setModal] = useState(null); // Web3Modal
  const [address, setAddress] = useState(null); // ETH address

  /**
   * Setup Web3Modal on page load (requires window)
   */
  const setupWeb3Modal = () => {
    // Creaste new web3Modal
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions: providerOptions,
    });

    // Set web3Modal
    setModal(web3Modal);
  };

  /**
   * Authenticate and store necessary items in global state
   */
  const authenticate = async () => {
    // Initiate web3Modal
    const web3Provider = await modal.connect();
    await web3Provider.enable();

    // Generate ethers provider
    const provider = new providers.Web3Provider(web3Provider);

    // Collect address
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);

    // Generate Zora provider
    const zora = new Zora(signer, 1);
    setZora(zora);
  };

  /**
   * Converts File to an ArrayBuffer for hashing preperation
   * @param {File} file uploaded file
   * @returns {ArrayBuffer} from file
   */
  const getFileBuffer = async (file) => {
    return new Promise((res, rej) => {
      // create file reader
      let reader = new FileReader();

      // register event listeners
      reader.addEventListener("loadend", (e) => res(e.target.result));
      reader.addEventListener("error", rej);

      // read file
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Mints media to Zora
   * @param {File} file media to mint
   * @param {String} name of media
   * @param {String} description of media
   * @param {Number} fee to share with previous owner
   */
  const mintMedia = async (file, name, description, fee) => {
    // Generate metadataJSON
    const metadataJSON = generateMetadata("zora-20210101", {
      description: description ? description : "",
      mimeType: file.type,
      name: name,
      version: "zora-20210101",
    });

    // Generate media buffer
    const buffer = await getFileBuffer(file);

    // Generate content hashes
    const contentHash = sha256FromBuffer(Buffer.from(buffer));
    const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));

    // Upload files to fleek
    let formData = new FormData();
    formData.append("upload", file);
    formData.append("name", name);
    formData.append("metadata", metadataJSON);

    // Post upload endpoint
    const upload = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Collect fileUrl and metadataUrl from Fleek
    const { fileUrl, metadataUrl } = upload.data;

    // Construct mediaData object
    const mediaData = constructMediaData(
      fileUrl,
      metadataUrl,
      contentHash,
      metadataHash
    );

    const bidShares = constructBidShares(
      0, // Creator share
      100 - parseFloat(fee), // Owner share
      parseFloat(fee) // Previous owner share
    );

    // Make transaction
    const tx = await zora.mint(mediaData, bidShares);
    await tx.wait(1); // Wait 1 confirmation and throw user to next screen
  };

  // On load events
  useEffect(setupWeb3Modal, []);

  return {
    address,
    mintMedia,
    authenticate,
  };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
