import express, { Router } from 'express';
import bodyParser from 'body-parser';
import Repo from '../models/Repo'

const router = Router();
module.exports = router;

/**
* @api {post}  /repos Create repo
* @apiName  Create Repo
* @apiGroup Repos 
* @apiVersion 1.0.0
*
* @apiParam {String} name  Name of the github repo
* @apiParam {String} pivotalAPIToken Token from API
* @apiParam {String} slackWebHookURL  Url from slack webhook for channel
* @apiParam {Number} [projectNumber]  Project number from Pivotal Tracker
* @apiParam {Boolean} [shouldAddLinkToPivatol]  true adds pivatol story when PR is created
* @apiParam {Boolean} [shouldChangeStateToDeliveredOnMerge]  true changes pivatol story to delivered once a story is delivered
* 
* @apiSuccessExample Success-Response
* HTTP/1.1 201 OK
*   {
*     "_id": "59c2a7a187b5d5084a507c91",
*     "shouldChangeStateToDeliveredOnMerge": true,
*     "shouldAddLinkToPivatol": true,
*     "projectNumber": 657416854,
*     "slackWebHookURL": "SomeURl for slack",
*     "createdAt": "2017-09-20T17:38:41.119Z",
*     "updatedAt": "2017-09-20T17:38:41.119Z",
*     "name": "Test repo",
*     "__v": 0
*   },
*
*
*/

router.post('/', (request, response) => {
  const newRepo = Repo(request.body);
  newRepo.save((error, repo) => {
    if (error) {
      response.status(500).send({error, repo});
    } else {
      response.send(repo);
    }
  });
});

/**
* @api {post}  /repos Get repos
* @apiName  Get Repos
* @apiGroup Repos 
* @apiVersion 1.0.0
*
* 
* @apiSuccessExample Success-Response
* HTTP/1.1 201 OK
*   [{
*     "_id": "59c2a7a187b5d5084a507c91",
*     "shouldChangeStateToDeliveredOnMerge": true,
*     "shouldAddLinkToPivatol": true,
*     "projectNumber": 657416854,
*     "slackWebHookURL": "SomeURl for slack",
*     "createdAt": "2017-09-20T17:38:41.119Z",
*     "updatedAt": "2017-09-20T17:38:41.119Z",
*     "name": "Test repo",
*     "__v": 0
*   },...]
*
*
*/


router.get('/', (request, response) => {
  Repo.find({}, (error, repos) => {
    if (error) response.status(500).send({error});
    response.send(repos);
  });
});

/**
* @api {post}  /repos Get repos
* @apiName  Get Repos
* @apiGroup Repos 
* @apiVersion 1.0.0
*
* 
* @apiSuccessExample Success-Response
* HTTP/1.1 201 OK
*   [{
*     "_id": "59c2a7a187b5d5084a507c91",
*     "shouldChangeStateToDeliveredOnMerge": true,
*     "shouldAddLinkToPivatol": true,
*     "projectNumber": 657416854,
*     "slackWebHookURL": "SomeURl for slack",
*     "createdAt": "2017-09-20T17:38:41.119Z",
*     "updatedAt": "2017-09-20T17:38:41.119Z",
*     "name": "Test repo",
*     "__v": 0
*   },...]
*
*
*/

router.get('/:id', (request, response) => {
  Repo.findById(request.params.id, (error, repo) => {
    if (error) response.status(500).send({error});
    response.send(repo);
  });
});

/**
* @api {put}  /repos/:id Update repo
* @apiName  Update Repo
* @apiGroup Repos 
* @apiVersion 1.0.0
*
* @apiParam {String} id  Id of the repo
* @apiParam {String} [name]  Name of the github repo
* @apiParam {String} [slackWebHookURL]  Url from slack webhook for channel
* @apiParam {Number} [projectNumber]  Project number from Pivotal Tracker
* @apiParam {Boolean} [shouldAddLinkToPivatol=true] true adds pivatol story when PR is created
* @apiParam {Boolean} [shouldChangeStateToDeliveredOnMerge=true]  true changes pivatol story to delivered once a story is delivered
* 
* @apiSuccessExample Success-Response
* HTTP/1.1 201 OK
*   {
*     "_id": "59c2a7a187b5d5084a507c91",
*     "shouldChangeStateToDeliveredOnMerge": true,
*     "shouldAddLinkToPivatol": true,
*     "projectNumber": 657416854,
*     "slackWebHookURL": "SomeURl for slack",
*     "createdAt": "2017-09-20T17:38:41.119Z",
*     "updatedAt": "2017-09-20T17:38:41.119Z",
*     "name": "Test repo",
*     "__v": 0
*   },
*
*
*/

router.put('/:id', (request, response) => {
  Repo.findByIdAndUpdate(request.params.id, request.body, {new : true}, (error, repo) => {
    if (error) response.status(500).send({error});
    response.send(repo)
  });
});

/**
* @api {delete}  /repos/:id Delete repo
* @apiName  Delete Repo
* @apiGroup Repos 
* @apiVersion 1.0.0
*
* @apiParam {String} id  Id of the repo
*
*
*/
router.delete('/:id', (request, response) => {
  Repo.findByIdAndRemove(request.params.id, (error) => {
    if (error) response.status(500).send({error});
    response.sendStatus(204)
  })
})
