const IBMCloudEnv = require('ibm-cloud-env');
const bodyParser = require('body-parser');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const vcapServices = require('vcap_services');
const fs = require('fs');
let workspaceId = process.env.WORKSPACE_ID || '<workspace-id>';
const port = process.env.PORT || 3000;
const MAX_RETRIES = 3;

/**
 * Create an assistant workspace based on training file provided
 * @param {Object} assistant Instance provided for Assistant to use
 * @param {Integer} retryCount Number of retries in case of failure
 * @param {Object} trainingFile Config file used to create workspace
 */
const createWorkspace = (assistant, retryCount, trainingFile) => {
  assistant.createWorkspace(trainingFile, function(err, response) {
    if (err) {
      if (retryCount > 1) {
        --retryCount;
        createWorkspace(assistant, retryCount, trainingFile);
      }
      else {
        console.log('Can not create workspace! Please go to Launch Tool provided in starter kits app page to create workspace manually');
      }
    } else {
      workspaceId = response.workspace_id;
      console.log(`Workspace has been created, The app is listening on http://localhost:${port}`);
    }
  });
};

const params = Object.assign({ version: '2018-02-16' }, fs.existsSync('server/localdev-config.json') ?
  vcapServices.getCredentialsForStarter('conversation', require('./../localdev-config.json')) :
  vcapServices.getCredentialsForStarter('conversation'));

const assistant = new AssistantV1(params);

module.exports = function(app) {
  app.use(bodyParser.json());

  /**
   * Endpoint to be call from the client side
   */
  app.post('/api/message', function(req, res) {
    if (!workspaceId || workspaceId === '<workspace-id>') {
      return res.json({
        output: {
          text: 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the Application Checklist in the Watson Console documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from the training file (<code>training/car_workspace.json</code>) in order to get a working application.'
        }
      });
    }
    var payload = {
      workspace_id: workspaceId,
      context: req.body.context || {},
      input: req.body.input || {}
    };

    // Send the input to the assistant service
    assistant.message(payload, function(err, data) {
      if (err) {
        return res.status(err.code || 500).json(err);
      }
      return res.json(data);
    });
  });
}

/**
 * Creates a workspace or use an existing one
*/
assistant.listWorkspaces(function(err, response) {
  if (err) {
    return;
  } else if (response.workspaces.length > 0) {
    workspaceId = response.workspaces[0].workspace_id;
  } else {
    console.log('creating a workspace...');
    createWorkspace(assistant, MAX_RETRIES, require('../../training/car_training.json'));
  }
});
