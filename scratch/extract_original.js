const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Krishna Prasath/.gemini/antigravity-ide/brain/5dfad528-34a3-48fb-ae3c-38928b470480/.system_generated/logs/transcript.jsonl', 'utf8').trim().split('\n');
const obj = JSON.parse(lines[211]);
const code = obj.tool_calls[0].args.ReplacementContent;

const vm = require('vm');
const sandbox = {};
vm.runInNewContext(code, sandbox);
console.log('Original items extracted:', sandbox.INITIAL_PRICE_LIST.length);
fs.writeFileSync('scratch/original_price_list.json', JSON.stringify(sandbox.INITIAL_PRICE_LIST, null, 2));
