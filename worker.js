const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require("worker_threads");

if (!isMainThread) {
  const { code, context } = workerData;
  Object.assign(globalThis, context);

	let e = eval(func);
  
	try {
		parentPort.postMessage(e);
	} catch {
		parentPort.postMessage("The operation completed successfully, but the data could not be transferred.");
	}
	
} else {
  module.exports = function evalAsync(code) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: code
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Thread exited with code: ${code}`));
      });
    });
  };
}