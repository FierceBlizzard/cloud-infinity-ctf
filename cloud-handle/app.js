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
let name;

function createId(){
  return 'trxxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createVM(templateName){
  this.name = createId();
  const [template] = await zone.getTemplate(templateName);

  const config = {
    http: true, 
    https: true,
    machineType: `n1-standard-1`,
    disks: [
      {
        kind: 'compute#attachedDisk',
        type: 'PERSISTENT',
        boot: true,
        mode: 'READ_WRITE',
        autoDelete: true,
        deviceName: name,
        initializeParams: {
          sourceImage: template.properties.disks[0].initializeParams.sourceImage,
          diskType: template.properties.disks[0].type,
          diskSizeGb: template.properties.disks[0].initializeParams.diskSizeGb,
        }, 
      }
    ]
  };

  const [vm, operation] = await zone.createVM(name, config);
  await operation.promise();

  const ipAddr = vm.networkInterfaces[0].accessConfigs[0].natIP;
  console.log(`VM created: ${name}`);
  console.log(`ip: ${ipAddr}`);

  return ipAddr;
}

async function removeVM(){
  try{
    await zone.deleteVM(name);
    console.log(`VM Deleted: ${name}`);
  }catch(error){
    console.error(`Error deleting VM ${name}:`, error);
  }
};

$("create-vm").on("click", async() => {
  console.log("clicked");
  try{
  const {externalIp} = await createVM(`tester`);
  $("ipz").html(`
    <h2>ip: ${externalIp}</h2>
  `);
  console.log(`30 seconds before deletetion`);
  setTimeout(()=> removeVM, 30000);
  } catch(error){
    console.error(`Error creating VM: `, error);
  }
});


app.use(express.json());
app.listen(8080);
