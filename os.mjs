import os from "node:os";

export const getEOL = () => {  
  console.log({EOL: os.EOL});
};

export const getCpus = () => {
  console.log(`Overall amount of CPUS: ${os.cpus().length}`);
  console.log(`Model: ${os.cpus()[0].model}`);
  os.cpus().forEach(({speed}, i)=>{
    console.log(`${i+1}. Clock rate: ${speed/1000} GHz` )
  })
};

export const getHomeDir = () => {
    console.log(`This is homedir: ${os.homedir()}`);
};

export const getUserName = () => {
    console.log(`Username OS: ${os.userInfo().username}`);
};

export const getCPUarch = () => {
    console.log(`CPU architecture: ${os.arch()}`);
};