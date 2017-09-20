import request from 'request';

function addLinkToStory(repo, pullRequest) {
  const { projectNumber, pivotalAPIToken} = repo;

  if (!projectNumber || !pivotalAPIToken) return

  const { body } = pullRequest;
  const url = getStoryURL(body, projectNumber);

  if (url === null) return


  const headers = {
    'X-TrackerToken': pivotalAPIToken,
    'Content-Type': 'application/json'
  };

  const options = {
    url,
    headers,
    method: 'GET'
  };

  request(options, (error, response, bodyString) => {
    let body = JSON.parse(bodyString)
    const { description } = body;
    const updatedDescription = `**[Pull Request](${pullRequest.html_url})**\n` + description
    
    const updatedStory = {
      description: updatedDescription
    }
    
    options.method = 'PUT'
    options.body = updatedStory
    options.json = true;

    request(options);

  });
}

function markStoryAsClosed(repo, pullRequest) {
  const { projectNumber, pivotalAPIToken} = repo;

  if (!projectNumber || !pivotalAPIToken) return

  const { body } = pullRequest;
  const url = getStoryURL(body, projectNumber);
  const headers = {
    'X-TrackerToken': pivotalAPIToken,
    'Content-Type': 'application/json'
  };

  const options = {
    url,
    headers,
    method: 'PUT',
    json: true,
    body: {current_state: 'delivered'}
  };
  
  request(options);
}

function getStoryURL(body, projectNumber) {
  const indexOfLink = body.indexOf('https://www.pivotaltracker.com/story/show/');
  
  if (indexOfLink === -1) return null
  
  const indexOfEndOfLink = body.indexOf(')', indexOfLink)
  const storyNumber = body.substring(indexOfLink + 42, indexOfEndOfLink)
  return `https://www.pivotaltracker.com/services/v5/projects/${projectNumber}/stories/${storyNumber}`;
}

module.exports = {
  addLinkToStory,
  markStoryAsClosed
}
