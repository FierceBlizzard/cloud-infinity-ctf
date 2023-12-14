 /**
 * TODO(developer): Uncomment and replace these variables before running the sample.
 */

const Compute = require('@google-cloud/compute');
const express = require('express');

const app = express();

const compute = new Compute({
  projectId: `infinite-ctf-405100`
});

const zone = compute.zone('us-east1');

function createId(){
  return 'trxxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const name = createId();
const config = {
    http: true,
    https: true,
    machineType: 'n1-standard-1',
    disks: [
        {
            'kind': 'compute#attachedDisk',
            'type': 'PERSISTENT',
            'boot': true,
            'mode': 'READ_WRITE',
            'autoDelete': true,
            'deviceName': name,
            'initializeParams': {
                'sourceImage': 'https://www.googleapis.com/compute/v1/projects/traderx-backend/global/images/trxdealer23',
                'diskType': 'https://www.googleapis.com/compute/v1/projects/traderx-backend/zones/us-east1-b/diskTypes/pd-standard',
                'diskSizeGb': 10
            }
        },
    ],
}

$("create-vm").on("click", ()=> {
  zone.createVM(name, config).then((data) =>{
    const ipAddr = data[0].networkInterfaces[0].accessConfigs[0].natIP;
    console.log(`vm created: ${name}`);
    console.log(`IP is: ${ipAddr}`);
    console.log(`You have 30 seconds`);
    setTimeout(removeVM(), 30000);
  });
});

async function removeVM(){
  try{
    await zone.deleteVM(name);
    console.log(`VM Deleted: ${name}`);
  }catch(error){
    console.error(`Error deleting VM ${name}:`, error);
  }
};

app.use(express.json());
app.listen(8080);
