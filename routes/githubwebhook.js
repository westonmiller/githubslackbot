import express, { Router } from 'express';
import bodyParser from 'body-parser';
import Repo from '../models/Repo';
import UsersNames from '../UsersNames';
import http from 'http-request';
import pivotalAPI from '../utilities/pivotalAPI'

const router = Router();
module.exports = router;

router.post('/', (request, response) => {
  const { action, pull_request, label, sender, repository } = request.body;

  if (action === 'labeled' || action === 'unlabeled') {
    var message = getResponse(request.body);
     if (action === 'labeled') {
      switch (label.name) {
        case 'Ready For Review':
        case 'Approved +1':
        case 'Last Call':
          sendSlackMessage(request, message);
          break;
        default:
          break;
      }
    } else {
      if (label.name === 'Don\'t Merge') {
        sendSlackMessage(request, message);
      }
    }
  }
  console.log(pull_request.merged)

  if (action === 'closed' && pull_request.merged) {
    var authorName = UsersNames[sender.login] || sender.login
    sendSlackMessage(request, {
      text: ':merged: ' + pull_request.html_url + ' by ' + authorName,
      username: 'Git Status'
    });
    console.log('in closed')
    Repo.findOne({ name: repository.name}, (error, repo) => {
      if (!error) {
        if (repo.shouldChangeStateToDeliveredOnMerge) {
          pivotalAPI.markStoryAsClosed(repo, pull_request)
        }
      }
    })
  }

  if (action === 'opened') {
    Repo.findOne({ name: repository.name}, (error, repo) => {
      if (!error) {
        if (repo.shouldAddLinkToPivatol) {
          pivotalAPI.addLinkToStory(repo, pull_request)
        }
      }
    });
  }

  response.json(message);
});

function sendSlackMessage(request, message) {
  const { name } = request.body.repository
  Repo.findOne({ name }, (error, repo) => {
    if (!error) {
      http.post({
        url: repo.slackWebHookURL,
        headers: {
          'Content-Type': 'application/json'
        },
        reqBody: new Buffer(JSON.stringify(message))
      }, () => { });
    }
  });
}

function getResponse(body) {

  var labelColor = '#' + body.label.color;
  var authorName = UsersNames[body.sender.login] || body.sender.login;
  var authorIcon = body.sender.avatar_url;
  var title = body.pull_request.title + ' #' + body.number;
  var pullRequestURL = body.pull_request.html_url;
  var text = 'The label `' + body.label.name + '` has been ' + (body.action == 'labeled' ? 'added.' : 'removed' )



  return {
    username: 'Git Status - ' + body.repository.name,
    attachments: [
      {
        color: labelColor,
        "author_name": authorName,
        "author_icon": authorIcon,
        "title": title,
        "title_link": pullRequestURL,
        "image_url": 'http://damp-springs-39574.herokuapp.com/images/' + body.label.name.replace(/ /g, '%20') + '.png',
        "ts": Date.now()/1000,
        mrkdwn_in: ['text']
      }
    ]
  }
}
