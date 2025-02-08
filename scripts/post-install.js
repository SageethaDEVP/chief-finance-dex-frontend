/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs-extra');
const path = require('path');

// Paths to folders
const uniswapSource = path.join(__dirname, '..', 'forks', '@uniswap', 'sdk');
const uniswapDest = path.join(__dirname, '..', 'node_modules', '@uniswap', 'sdk');
const bidelitySource = path.join(__dirname, '..', 'forks', '@bidelity');
const bidelityDest = path.join(__dirname, '..', 'node_modules', '@bidelity');

async function postInstall() {
  try {
    // Remove the existing @uniswap/sdk folder
    await fs.remove(uniswapDest);
    console.log('@uniswap/sdk removed successfully.');

    // Copy the @uniswap/sdk folder
    await fs.copy(uniswapSource, uniswapDest);
    console.log('@uniswap/sdk copied successfully!');

    // Copy the @bidelity folder
    await fs.copy(bidelitySource, bidelityDest);
    console.log('@bidelity copied successfully!');
  } catch (error) {
    console.error('Error during postinstall:', error);
    process.exit(1);
  }
}

postInstall();
