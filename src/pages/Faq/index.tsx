import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import { TEXT } from '../../theme';
import { AutoColumn } from '../../components/Column';
import { CommonHeaderWrapper, CommonPageBody, CommonPageWrapper } from '../../components/service-agreement/common';
import styled from 'styled-components';
import { Flex } from 'rebass';
import { Link } from 'react-router-dom';

interface Props {
  question: string;
  answer: string | ReactNode;
  children?: ReactNode;
  answer2?: string | ReactNode;
  answer3?: string | ReactNode;
  answer4?: string | ReactNode;
}

const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.newTheme.textSecondary};
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  opacity: 0.3;
`;
const Align = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;
`;

const Body = styled(CommonPageBody)``;

const MultitextAnswer = styled(Flex)`
  flex-direction: column;
`;

const StyledLi = styled.li`
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ theme }) => theme.newTheme.textSecondary}}

  a {
    color: #8E8FF4;
  }
`;

const LiDecimals = styled(StyledLi)`
  list-style-type: decimal;
`;

const Ul = styled.ul`
  margin: 10px 0 0 0;
`;

const StyledA = styled.a`
  color: #8e8ff4;
`;

const StyledLink = styled(Link)`
  color: #8e8ff4;
`;

// const FlexColumn = styled.div`
//   display: flex;
//   flex-direction: column;
// `

export default function Faq() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView();
    }
  }, []);
  return (
    <CommonPageWrapper>
      <CommonHeaderWrapper ref={ref}>
        <Header showBottom={true} />
      </CommonHeaderWrapper>
      <Body>
        <AutoColumn gap="40px">
          <TEXT.primary fontSize={32} fontWeight={600}>
            FAQ’S
          </TEXT.primary>
          <div>
            <AutoColumn gap="20px">
              <AutoColumn gap="10px">
                {/*<TEXT.secondary fontWeight={500} fontSize={14} lineHeight="24px">*/}
                {/*  What&#39;s so great about being bald? why do I need Head Wash anyway? Isn&#39;t soap just as good? Can*/}
                {/*  I use it on my face?*/}
                {/*</TEXT.secondary>*/}
                <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                  General
                </TEXT.secondary>
              </AutoColumn>
              <div>
                <AutoColumn gap="20px">
                  <FaqDropdown
                    question={'What is Chief Finance?'}
                    answer={
                      'Chief Finance is a decentralized cryptocurrency exchange where you can safely and conveniently exchange tokens at the most favorable terms. Chief Finance has no centralized management authority, allowing users to interact directly with the blockchain.'
                    }
                  />
                  <FaqDropdown
                    question={'How to trade on Chief Finance?'}
                    answer={
                      'To take advantage of trading on Chief Finance and get all the benefits of the platform, you only need to do 5 things:'
                    }
                    answer2={
                      'After that, you will see a status window for your transaction, which will provide information about the exchange, as well as the approximate wait time.\n'
                    }
                  >
                    <Ul>
                      <LiDecimals>Connect your wallet on the website</LiDecimals>
                      <LiDecimals>
                        Go to the <Link to="/swap">swaps</Link> section if you want to make a trade right now, or to the
                        limit trading section to specify the desired exchange price
                      </LiDecimals>
                      <LiDecimals>Select the desired token pair to be exchanged</LiDecimals>
                      <LiDecimals>
                        {'Start the exchange by clicking "Swap" or place a limit order by clicking "Place Order"'}
                      </LiDecimals>
                      <LiDecimals>Confirm the transaction in your wallet</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What features does Chief Finance provide?'}
                    answer={
                      'Chief Finance is committed to developing the DeFi ecosystem to make it easier for you to interact with the blockchain. Therefore, among our features you can find:'
                    }
                    answer2={'Take advantage of Chief Finance now. No registration is required.'}
                  >
                    <Ul>
                      <StyledLi>swap</StyledLi>
                      <StyledLi>liquidity provision</StyledLi>
                      <StyledLi>limit trading</StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What is an approval transaction?'}
                    answer={
                      'To reap the benefits of working with Chief Finance, you need to provide the ability to interact with your cryptocurrency wallet. The ideal solution is an approval transaction.'
                    }
                    answer2={
                      'Your wallet will ask you to specify the number of tokens you want to approve. Enter a value that is equal to or greater than the number of tokens to exchange.'
                    }
                    answer3={
                      'An approval transaction allows the Chief Finance protocol to use a specified portion of your tokens to make an exchange on the Ethereum network. Follow these instructions to complete an approval transaction:'
                    }
                    answer4={
                      'To confirm that the endorsement belongs to you, this transaction is done on the Ethereum network. Therefore, you need to have a minimum amount of ETH in your balance to pay the blockchain fee.'
                    }
                  >
                    <Ul>
                      <LiDecimals>Enter the necessary data for the exchange: token pair and their quantity</LiDecimals>
                      <LiDecimals>{'Click "Confirm exchange" after viewing the details of the transaction'}</LiDecimals>
                      <LiDecimals>Confirm the exchange token costs</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What is a transaction hash?'}
                    answer={
                      'A transaction hash is an identifier that provides evidence that a particular action has been validated and added to the blockchain. In the Ethereum network, it always consists of 64 hexadecimal characters prefixed with 0x and can be used as:'
                    }
                    answer2={
                      <>
                        After completing the exchange in Chief Finance, you will be able to view the hash of your
                        transaction in The{' '}
                        <StyledA href="https://etherscan.io/" target="_blank" rel="noreferrer">
                          Ethereum Blockchain Explorer
                        </StyledA>{' '}
                        to clarify the details of the transaction.
                      </>
                    }
                  >
                    <Ul>
                      <StyledLi>transaction confirmation</StyledLi>
                      <StyledLi>a tool for specifying transaction data such as time, volume, fees, etc.</StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'How do I know the address of my cryptocurrency wallet?'}
                    answer={
                      'The process of finding out your address may differ depending on which cryptocurrency wallet you use. Nevertheless, there are general recommendations for finding it, such as:'
                    }
                    answer2={
                      'You can use it to accept payments, identify, and view transactions in the Blockchain Explorer.'
                    }
                  >
                    <Ul>
                      <LiDecimals>Open your cryptocurrency wallet app or extension</LiDecimals>
                      <LiDecimals>Select the desired blockchain network</LiDecimals>
                      <LiDecimals>Select the desired token pair to be exchanged</LiDecimals>
                      <LiDecimals>
                        {
                          'Find the value that starts with the character "0x". This is the address of your cryptocurrency wallet\n'
                        }
                      </LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'How can I report a bug?'}
                    answer={
                      <>
                        You can send the email with the title “Bug” on address:{' '}
                        <StyledA href="mailto:chief.finance7@gmail.com">chief.finance7@gmail.com</StyledA>
                      </>
                    }
                  />
                  <FaqDropdown
                    question={"I can't find an answer to my question. Where do I find an answer?"}
                    answer={
                      "If you can't find what you're looking for in Chief Finance's documentation, ask your question on Chief Finance's official social media platforms and someone will do their best to help you out."
                    }
                  >
                    <Ul>
                      <StyledLi>
                        <span>
                          Telegram:{' '}
                          <StyledA href="https://t.me/+BOy8uCAeY6RhOWJh" target="_blank">
                            link
                          </StyledA>
                        </span>
                      </StyledLi>
                      <StyledLi>
                        <span>
                          Twitter:{' '}
                          <StyledA
                            href="https://twitter.com/i/flow/login?redirect_after_login=%2Fchieffinan82039"
                            target="_blank"
                          >
                            link
                          </StyledA>
                        </span>
                      </StyledLi>
                      <StyledLi>
                        <span>
                          Discord:{' '}
                          <StyledA href="https://discord.com/invite/Kk4hSNxnjN" target="_blank">
                            link
                          </StyledA>
                        </span>
                      </StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                    Getting Started with Chief Finance
                  </TEXT.secondary>
                  <FaqDropdown
                    question={'What is a cryptocurrency wallet?'}
                    answer={
                      'A cryptocurrency wallet is a program, device, or service that stores your private keys, providing security in the blockchain. With a cryptocurrency wallet, you can accept, send, and store tokens on Ethereum, Polygon, Arbitrum, and other networks.'
                    }
                    answer3={'The most popular cryptocurrency wallets are:'}
                    answer2={
                      'Cryptocurrencies can be cold - physical devices, and hot - desktop and mobile apps, as well as browser extensions.'
                    }
                  >
                    <Ul>
                      <StyledLi>Metamask</StyledLi>
                      <StyledLi>Trust Wallet</StyledLi>
                      <StyledLi>Ledger Nano X</StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What is the best wallet to use to work with Chief Finance?'}
                    answer={
                      'Choosing a cryptocurrency wallet is an individual process that depends on factors such as security, convenience, and transaction execution.'
                    }
                    answer3={
                      'In turn, Chief Finance aims to expand your actions in the DeFi sector, so we provide the opportunity to use Metamask and the Wallet Connect protocol. With its help, you can connect any of the most popular cryptocurrency wallets, and the QR code function allows you to do it with the help of a mobile app.'
                    }
                  />
                  <FaqDropdown
                    question={'How to start using a cryptocurrency wallet?'}
                    answer={'Here are 4 steps you can follow to get started using a cryptocurrency wallet:'}
                    answer2={
                      'The cryptocurrency wallet setup process may differ depending on the option you choose. However, by following our guide, you will be able to start using the most popular crypto wallets on the market.'
                    }
                  >
                    <Ul>
                      <LiDecimals>Install a mobile app or browser extension for your cryptocurrency wallet</LiDecimals>
                      <LiDecimals>Create an account and make up a password</LiDecimals>
                      <LiDecimals>
                        Write down the secret phrase in a safe place. We recommend using resources that are not
                        connected to the internet, such as a piece of paper.
                      </LiDecimals>
                      <LiDecimals>Finalize the account creation by confirming your passphrase</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'How do I connect Metamask to Chief Finance?'}
                    answer={'To connect Metamask to Chief Finance, you need to do the following steps:'}
                    answer2={
                      'We recommend you check the domain name in the Metamask window carefully. It should exactly match the Chief Finance domain.'
                    }
                  >
                    <Ul>
                      <LiDecimals>{'Select "Connect Wallet" in the upper right corner of the site'}</LiDecimals>
                      <LiDecimals>Among the available options, select Metamask</LiDecimals>
                      <LiDecimals>Enter your password if required by the Metamask extension</LiDecimals>
                      <LiDecimals>{'In the window that appears, click "Next", then "Connect"'}</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'How do I connect to Chief Finance using Wallet Connect?'}
                    answer={
                      'Wallet Connect is a blockchain protocol that allows your wallet to connect to various decentralized services. To connect to Chief Finance, you need to:'
                    }
                    answer2={
                      'We recommend you check the domain name in your wallet window carefully. It should exactly match the Chief Finance domain.'
                    }
                  >
                    <Ul>
                      <LiDecimals>{'In the upper right corner of the site, select "Wallet Connect"'}</LiDecimals>
                      <LiDecimals>{'Among the available options, select "Wallet Connect"'}</LiDecimals>
                      <LiDecimals>
                        {
                          'For mobile applications - scan the QR code; for desktop applications - select the appropriate wallet from the list'
                        }
                      </LiDecimals>
                      <LiDecimals>{'In the window that appears, click "Next", then "Connect"'}</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                    Liquidity provision
                  </TEXT.secondary>
                  <FaqDropdown
                    question={'What is liquidity provision?'}
                    answer={
                      'Liquidity provisioning is the process of transferring tokens to provide liquidity to a decentralized platform such as DEX or AMM. This process refers to the conversion of regular tokens to corresponding LP tokens.'
                    }
                    answer2={
                      "LP tokens are a confirmation that the user has locked his base tokens in one of the exchange's liquidity pools. By using them, he can claim to receive the initial stake and additional rewards."
                    }
                  />
                  <FaqDropdown
                    question={'How is the reward for providing liquidity achieved?'}
                    answer={
                      'Part of the commission paid by the user when exchanging tokens goes to reward liquidity providers. It is essential to realize that the rewards go to users who have contributed their tokens to the respective pool.'
                    }
                    answer2={
                      'Therefore, if you want to provide your tokens for liquidity, choose the most popular pools.'
                    }
                  />
                  <FaqDropdown
                    question={'What is the risk of impermanent loss?'}
                    answer={
                      'To realize what the risk of impermanent loss is, it is worth understanding how an automated market maker (AMM) works.'
                    }
                    answer3={
                      'The main concept of AMM is that the price of a token is formed not by supply and demand, as it happens on conventional exchanges, but by the ratio of one token in the pool to another. Thus, the number of tokens in the liquidity pool is constantly changing, depending on the market price of the assets.'
                    }
                    answer2={
                      'The risk of impermanent loss is the potential loss that a liquidity provider may suffer due to changes in the price of the provided tokens.'
                    }
                    answer4={
                      "When a user blocks his tokens, he becomes the owner of some share in the corresponding liquidity pool. If the price of a token changes, this will change the number of tokens in the pool. In this case, if the liquidity provider wants to withdraw its assets, it will receive a certain portion of the pool's tokens, not the amount of tokens originally invested."
                    }
                  />
                  <FaqDropdown
                    question={'What is the minimum lock-in period for my tokens in the liquidity pool?'}
                    answer={
                      <>
                        The minimum blocking period for tokens may vary depending on the liquidity pool. For up-to-date
                        information, we recommend going to the <StyledLink to="/pool">{'"Pool"'}</StyledLink> section,
                        where you can find out not only the blocking period but also the reward conditions for the
                        variant you need.
                      </>
                    }
                  />
                  <FaqDropdown
                    question={'What reward will I receive for providing liquidity?'}
                    answer={
                      <>
                        Liquidity provision rewards may vary depending on the token pair you choose. We recommend going
                        to the <StyledLink to="/pool">{'"Pool"'}</StyledLink> section for up-to-date information.
                      </>
                    }
                  />
                  <FaqDropdown question={'Can I withdraw my tokens before the original deadline?'} answer={'Yes.'} />
                  <FaqDropdown
                    question={'How to provide liquidity to Chief Finance?'}
                    answer={
                      'To provide liquidity to Chief Finance, you will need to go to "Pool" and follow the steps below:'
                    }
                    answer2={
                      'After successful approval of the transaction, you will receive the corresponding LP tokens, which are the identifier of your share in the pool. After the lock-in period expires or sooner, you will be able to exchange them for a portion of the tokens in the pool.'
                    }
                  >
                    <Ul>
                      <StyledLi>{'Click "Add Liquidity"'}</StyledLi>
                      <StyledLi>Select the appropriate token pair</StyledLi>
                      <StyledLi>Specify the number of tokens to be provided and the blocking period</StyledLi>
                      <StyledLi>Confirm the transaction in your cryptocurrency wallet</StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What liquidity pools are available with Chief Finance?'}
                    answer={
                      'Chief Finance provides the most popular tokens for exchange to provide high returns for liquidity providers. On our platform, you will find token pairs such as:'
                    }
                    answer2={
                      <>
                        This is only a few of the instruments offered by Chief Finance. You can see the full list of
                        available liquidity pools in the <StyledLink to="/pool">{'"Pool"'}</StyledLink> section.
                      </>
                    }
                  >
                    <Ul>
                      <StyledLi>CFNC-USDT</StyledLi>
                      <StyledLi>CFNC-ETH</StyledLi>
                      <StyledLi>DAI-USDT</StyledLi>
                    </Ul>
                  </FaqDropdown>
                  <FaqDropdown
                    question={'What is a v2 liquidity pool?'}
                    answer={
                      'A liquidity pool is a smart contract that holds the assets of liquidity providers to execute transactions for a specific pair of tokens. Most often, one of the tokens will be ETH. That is, in regular liquidity pools, you can provide ETH and some additional token, such as USDT.'
                    }
                    answer2={
                      'The V2 liquidity pool is ERC-20/ERC-20 compliant, allowing liquidity providers to provide tokens in this format. This approach eliminates the need to own ETH, providing flexibility for users.'
                    }
                  />
                  <FaqDropdown
                    question={'What is ERC-20?'}
                    answer={
                      'ERC-20 is the standard used to create smart contracts on the Ethereum network. It defines a set of rules that developers must follow while creating tokens on this network.'
                    }
                  />
                  <FaqDropdown
                    question={'How to withdraw the liquidity I have provided?'}
                    answer={'Follow these steps to withdraw the provided liquidity from the pool:'}
                    answer2={
                      'After confirming the transaction, you will receive both tokens from the selected pair. If you have withdrawn only part of the liquidity, the remaining share will be displayed in the "Your active liquidity" section.'
                    }
                  >
                    <Ul>
                      <LiDecimals>
                        Visit the <StyledLink to="/pool">{'"Pool"'}</StyledLink> section
                      </LiDecimals>
                      <LiDecimals>
                        {
                          'Select the desired position from which you want to withdraw liquidity in the "Your Active Liquidity" section'
                        }
                      </LiDecimals>
                      <LiDecimals>{'Click "Remove"'}</LiDecimals>
                      <LiDecimals>
                        {
                          'Specify the amount of liquidity you want to withdraw. You can also use "Max" to withdraw all liquidity.'
                        }
                      </LiDecimals>
                      <LiDecimals>{'Click "Remove"'}</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                  <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                    Swap
                  </TEXT.secondary>

                  <FaqDropdown
                    question={'What is a token swap?'}
                    answer={
                      'Token swap is the instantaneous exchange of one cryptocurrency for another, without the need to convert to fiat. This is possible through centralized and decentralized exchanges, p2p platforms, and AMMs.'
                    }
                    answer2={
                      <>
                        On Chief Finance, you can exchange one token for another without intermediaries. Use the
                        <StyledLink to="/swap">{'"Exchange"'}</StyledLink> section to take advantage of all the benefits
                        of working with the platform right now!
                      </>
                    }
                  />

                  <FaqDropdown
                    question={'How does token swap work?'}
                    answer={
                      'In the case of decentralized platforms that implement blockchain-based exchanges, token swap works as follows:'
                    }
                    answer2={
                      'A smart contract ensures that the user receives the required number of "tokens B" after sending "token A". This eliminates the need for intermediaries and makes the transaction faster and more profitable.'
                    }
                  >
                    <Ul>
                      <LiDecimals>The user specifies a pair of tokens and their quantity to be exchanged</LiDecimals>
                      <LiDecimals>{'The platform receives a request to exchange "token A" for "token B"'}</LiDecimals>
                      <LiDecimals>
                        {
                          'The smart contract, which is the corresponding liquidity pool, receives "token A" from the user and sends "token B" in return.'
                        }
                      </LiDecimals>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'What crypto assets can I exchange?'}
                    answer={'Using Chief Finance, you can exchange the most popular crypto assets. Among them:'}
                    answer2={
                      <>
                        Our platform is constantly evolving to make your interaction in DeFi easier and more convenient.
                        Therefore, we recommend checking the current list of tokens in the{' '}
                        <StyledLink to="/swap">{'"Exchange"'}</StyledLink> section of our website.
                      </>
                    }
                  >
                    <Ul>
                      <StyledLi>USDT</StyledLi>
                      <StyledLi>ETH</StyledLi>
                      <StyledLi>BAT</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'On which networks can I exchange my tokens?'}
                    answer={
                      'Chief Finance cares about its users. We work with those tools that provide the best security, speed, and cost of transaction processing. Therefore, you can only exchange your tokens on the Ethereum network!'
                    }
                  />
                  <FaqDropdown
                    question={'How to exchange tokens on the Ethereum network?'}
                    answer={
                      <>
                        Before exchanging cryptocurrency on the Ethereum network, you need to fund your wallet with a
                        minimum amount of the {"network's"} native token, ETH. Since all transactions take place on the
                        blockchain, you must pay a{' '}
                        <StyledA href="https://etherscan.io/gastracker" target="_blank">
                          gas fee
                        </StyledA>{' '}
                        so that network participants can confirm the transaction.
                      </>
                    }
                    answer2={
                      <>
                        After that, your transaction status window will appear on the site. Once completed, you will be
                        able to check it in{' '}
                        <StyledA href="https://etherscan.io/" target="_blank" rel="noreferrer">
                          The Ethereum Block Explorer
                        </StyledA>
                        .
                      </>
                    }
                    answer3={
                      'If you already have enough ETH in your crypto wallet, use this guide to exchange tokens on the Ethereum network:'
                    }
                  >
                    <Ul>
                      <StyledLi>
                        Go to the <StyledLink to="/swap">{'"Exchange"'}</StyledLink> section of the website
                      </StyledLi>
                      <StyledLi>Select the required pair of tokens and specify the quantity</StyledLi>
                      <StyledLi>{'Click "Exchange"'}</StyledLi>
                      <StyledLi>
                        In the window of your cryptocurrency wallet that appears, confirm the approval transaction
                      </StyledLi>
                      <StyledLi>Provide access to the required number of tokens</StyledLi>
                      <StyledLi>Confirm the exchange transaction</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'How to reduce transaction fees on the Ethereum network?'}
                    answer={
                      'The cost of gas is affected by network utilization. The more users use the blockchain, the higher the cost of gas. Therefore, a great way to reduce transaction fees on the Ethereum network is to find a period when the network is less busy.'
                    }
                    answer2={
                      'Statistically, the UTC 04:00 - 07:00 period is when gas fees are the lowest throughout the day. You can use this time to make transactions to save on fees.'
                    }
                  />

                  <FaqDropdown
                    question={'What is price impact?'}
                    answer={
                      'Price impact is the correlation between the market price and the volume of the asset in the order. The larger the volume of the order in the order book, the greater its influence on the price. Buy orders cause the price to rise and sell orders cause the price to fall.'
                    }
                  />

                  <FaqDropdown
                    question={'What is slippage?'}
                    answer={
                      'Slippage is the difference between the expected and actual transaction price. Usually, slippage can be caused by:'
                    }
                    answer2={
                      'Chief Finance provides the ability to customize slippage to make a trade within an acceptable price range. When the price exceeds the slippage limit, the order will be reversed.'
                    }
                  >
                    <Ul>
                      <StyledLi>high market volatility</StyledLi>
                      <StyledLi>{'lack of volume to execute a "large" order'}</StyledLi>
                      <StyledLi>during the release of important financial reports and news</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'How do I adjust the slippage?'}
                    answer={'Follow the steps below to adjust the slip:'}
                    answer2={'If the price changes within this price range, your trade will be refunded.'}
                  >
                    <Ul>
                      <StyledLi>
                        Go to the <StyledLink to="/swap">{'"Exchange"'}</StyledLink> section
                      </StyledLi>
                      <StyledLi>{'Find "Allowable slippage" and click on the cogwheel\n'}</StyledLi>
                      <StyledLi>Select or manually specify the allowable slippage value</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'How long does it take to exchange tokens?'}
                    answer={
                      'As all Chief Finance transactions are handled in Ethereum, token exchanges typically take between 15 seconds and 5 minutes. This value is affected by factors such as fees, as well as network utilization, and bandwidth.'
                    }
                  />

                  <FaqDropdown
                    question={'Can I cancel my swap order?'}
                    answer={
                      'No. The way the blockchain works makes it impossible to cancel a transaction once it has been recorded on the blockchain.'
                    }
                  />

                  <FaqDropdown
                    question={"Why I can't do a token swap?"}
                    answer={
                      "The number of reasons why you can't swap tokens can number in the dozens. We have prepared the most popular ones:"
                    }
                    answer2={
                      "If you haven't found a solution in this section, ask your question on Chief Finance's official social media platforms and you'll be sure to get help."
                    }
                    answer4={
                      <>
                        <AutoColumn gap="4px">
                          <span>
                            Telegram:{' '}
                            <StyledA href="https://t.me/+BOy8uCAeY6RhOWJh" target="_blank">
                              link
                            </StyledA>
                          </span>
                          <span>
                            Twitter:{' '}
                            <StyledA
                              href="https://twitter.com/i/flow/login?redirect_after_login=%2Fchieffinan82039"
                              target="_blank"
                            >
                              link
                            </StyledA>
                          </span>
                          <span>
                            Discord:{' '}
                            <StyledA href="https://discord.com/invite/Kk4hSNxnjN" target="_blank">
                              link
                            </StyledA>
                          </span>
                        </AutoColumn>
                      </>
                    }
                  >
                    <Ul>
                      <StyledLi>
                        <b>An insufficient number of tokens to pay the fee.</b> Check if your cryptocurrency wallet
                        balance has enough ETH on the Ethereum network.
                      </StyledLi>
                      <StyledLi>
                        <b>No access to use tokens.</b> Clarify the value you specified during the approval transaction.
                        It should be equal to or greater than the number of tokens to exchange.
                      </StyledLi>
                      <StyledLi>
                        <b>A strong influence on the price.</b> Try increasing the slippage or reducing the transaction
                        amount. Usually, this problem is due to low liquidity.
                      </StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'Where can I view smart contracts?'}
                    answer={
                      "Use the links below to familiarize yourself with Chief Finance's smart contracts on the Ethereum blockchain."
                    }
                    answer2={'Chief contracts:'}
                    answer4={'Links:'}
                  />

                  <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                    Limit orders
                  </TEXT.secondary>

                  <FaqDropdown
                    question={'What is a limit order?'}
                    answer={
                      'A limit order is an indication to buy or sell an asset at a certain price. In the case of Chief Finance, with the help of the limit order function, you can exchange tokens at a favorable rate.'
                    }
                    answer2={'Chief contracts:'}
                  />

                  <FaqDropdown
                    question={'What assets are available for limit order trading?'}
                    answer={'Using Chief Finance, you can exchange the most popular crypto assets. Among them:'}
                    answer2={
                      'Our platform is constantly evolving to make your interaction in DeFi easier and more convenient. Therefore, we recommend checking the current list of tokens in the "Limit Orders" section of our website.'
                    }
                  >
                    <Ul>
                      <StyledLi>USDT</StyledLi>
                      <StyledLi>BAT</StyledLi>
                      <StyledLi>UNI</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <FaqDropdown
                    question={'Can I place a limit order below the market price?'}
                    answer={
                      'No. A limit order is executed at a set or more favorable price. To place an exchange order below the market value, you must use a stop-limit order.'
                    }
                  />

                  <FaqDropdown
                    question={'What is the expiration date of my limit orders?'}
                    answer={'90 days from the date of the order.'}
                  />

                  <FaqDropdown
                    question={'Can I cancel a limit order before execution?'}
                    answer={
                      'Yes. To do this, go to the "Limit Orders" section and select "Open Orders". In the list that appears, find the desired option and click "Cancel".'
                    }
                  />

                  <FaqDropdown
                    question={"Why hasn't my order been fulfilled?"}
                    answer={
                      'Limit orders are executed when they reach the desired price. However, due to fluctuations in the cost of gas, the actual price may differ from the price you specify in the interface.'
                    }
                    answer2={
                      'If the tips in this section failed to solve your problem, please contact support. Our team will help you!'
                    }
                    answer3={'Therefore, your order may not be honored because of the following reasons:'}
                  >
                    <Ul>
                      <StyledLi>Failed to execute the entire order at the desired price due to price impact</StyledLi>
                      <StyledLi>Not enough volume to execute your order at the specified price</StyledLi>
                      <StyledLi>One of the tokens in the limit order has a transfer fee</StyledLi>
                    </Ul>
                  </FaqDropdown>

                  <TEXT.secondary fontWeight={500} fontSize={20} lineHeight="24px">
                    Chief Finance Coin
                  </TEXT.secondary>

                  <FaqDropdown
                    question={'What is CFNC?'}
                    answer={'CFNC is a native token of the decentralized exchange Chief Finance.'}
                  />

                  <FaqDropdown
                    question={'What is CFNC used for?'}
                    answer={'The CFNC is used to reward development and support the operation of the platform.'}
                  />

                  <FaqDropdown
                    question={'How can I buy a CFNC?'}
                    answer={'Follow these steps to buy a CFNC:'}
                    answer2={
                      'After that, you will see how much CFNC you can buy with your cryptocurrency. Click "Exchange" and confirm the transaction in your crypto wallet to receive the CFNC.'
                    }
                  >
                    <Ul>
                      <LiDecimals>
                        Go to the <StyledLink to="/swap">{'"Exchange"'}</StyledLink> section
                      </LiDecimals>
                      <LiDecimals>Specify the token you want to buy CFNC for</LiDecimals>
                      <LiDecimals>Specify CFNC as the token you wish to receive</LiDecimals>
                    </Ul>
                  </FaqDropdown>
                </AutoColumn>
              </div>
            </AutoColumn>
          </div>
        </AutoColumn>
      </Body>
    </CommonPageWrapper>
  );
}

const FaqDropdown = ({ question, answer, children, answer2, answer3, answer4 }: Props) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return (
    <div>
      <Align>
        <TEXT.secondary fontWeight={600} fontSize={20} lineHeight="24px" onClick={toggle} marginRight="14px">
          {open ? '-' : '+'}
        </TEXT.secondary>
        <TEXT.secondary fontWeight={600} fontSize={14} lineHeight="24px" onClick={toggle}>
          {question}
        </TEXT.secondary>
      </Align>

      <Separator />
      {open && (
        <MultitextAnswer>
          <TEXT.secondary fontWeight={500} fontSize={14} lineHeight="24px">
            {answer}
          </TEXT.secondary>
          {answer3 && (
            <TEXT.secondary fontWeight={500} fontSize={14} lineHeight="24px" marginTop="10px">
              {answer3}
            </TEXT.secondary>
          )}
          {children}
          <TEXT.secondary fontWeight={500} fontSize={14} lineHeight="24px" marginTop="10px">
            {answer2}
          </TEXT.secondary>
          {answer4 && (
            <TEXT.secondary fontWeight={500} fontSize={14} lineHeight="24px" marginTop="10px">
              {answer4}
            </TEXT.secondary>
          )}
        </MultitextAnswer>
      )}
    </div>
  );
};
