const moment = require('moment');
const axios = require('axios').default;
const prompts = require('prompts');
const chalk = require('chalk');

function print(msg, isError = false) {
  const now = moment().format('DD/MM/YYYY HH:mm:ss');
  if (isError) {
    console.log(`[${now}]`, chalk.red(msg));
  } else {
    console.log(`[${now}]`, chalk.green(msg));
  }
}

async function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

async function req(addr, amount) {
  try {
    let str = addr;
    if (str.startsWith('0x')) str = str.substr(2);

    const res = await axios({
      method: 'POST',
      baseURL: 'https://faucet.devnet.aptoslabs.com',
      url: '/mint',
      params: {
        amount: amount,
        address: str,
      },
    });

    print(res.data[0]);
  } catch (err) {
    print(err, true);
  }
}

async function main() {
  let addr = process.env.APTOS_ADDR;
  let amount = process.env.MINT_AMOUNT;
  let delay = process.env.DELAY;

  if (addr === undefined || addr === null) {
    let res = await prompts({
      type: 'text',
      name: 'addr',
      message: 'APTOS Address: ',
    });

    addr = res.addr;
  }

  if (amount === undefined || amount === null) {
    let res = await prompts({
      type: 'number',
      name: 'amount',
      message: 'Mint Amount: ',
    });

    amount = res.amount;
  }
  
  if (delay === undefined || delay === null) {
    let res = await prompts({
      type: 'number',
      name: 'delay',
      min: 1000,
      message: 'Delay (ms): ',
    });

    delay = res.delay;
  }

  while (true) {
    await req(addr, amount);
    await wait(delay);
  }
};

main();