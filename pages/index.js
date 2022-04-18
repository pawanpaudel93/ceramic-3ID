import styles from '../styles/Home.module.css'
import { useEffect, useRef } from "react"
import { useViewerConnection } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";
import {providers} from "ethers";
import Web3Modal from "web3modal"

import RecordSetter from "../components/RecordSetter"

export default function Home() {
  const [connection, connect, disconnect] = useViewerConnection();
  const web3ModalRef = useRef();

  const getProvider = async () => {
    const provider = await web3ModalRef.current.connect();
    const wrappedProvider = new providers.Web3Provider(provider);
    return wrappedProvider;
  }

  const getEthereumAuthProvider = async () => {
    const wrappedProvider = await getProvider();
    const signer = await wrappedProvider.getSigner();
    const address = await signer.getAddress();
    return new EthereumAuthProvider(wrappedProvider.provider, address);
  }

  const connectToSelfID = async () => {
    const ethereumAuthProvider = await getEthereumAuthProvider();
    connect(ethereumAuthProvider);
  }

  useEffect(() => {
    if (connection.status !== "connected") {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions:{},
        disableInjectedProvider: false
      });
    }
  }, [connection.status]);

  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <span className={styles.title}>Ceramic Demo</span>
        {connection.status === "connected" ? (
          <span className={styles.subtitle}>Connected</span>
        ):(<button onClick={connectToSelfID} className={styles.button} disabled={connection.status==='connecting'}>Connect</button>)}
      </div>
      <div className={styles.content}>
        <div className={styles.connection}>
          {connection.status === "connected" ? (
            <div>
              <span className={styles.subtitle}>Your 3ID is {connection.selfID.id}</span>
              <RecordSetter />
            </div>
          ):(
            <span className={styles.subtitle}>Connect to your wallet to access your 3ID</span>
          )}
        </div>
      </div>
    </div>
  )
}
