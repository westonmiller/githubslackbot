import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const repoSchema = new Schema({
  name: String,
  slackWebHookURL: String,
  projectNumber: Number,
  shouldAddLinkToPivatol: Boolean,
  shouldChangeStateToDeliveredOnMerge: Boolean,
  pivotalAPIToken: String,
  createdAt: Date,
  updatedAt: Date
});

repoSchema.pre('save', function(next) {
  const currentDate = new Date();

  this.updatedAt = currentDate;

  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  if (!this.slackWebHookURL) {
    this.slackWebHookURL = null
  }

  if (!this.projectNumber) {
    this.projectNumber = null
    this.shouldAddLinkToPivatol = false
    this.shouldChangeStateToDeliveredOnMerge = false
  }
  
  if (!this.shouldAddLinkToPivatol) {
    this.shouldAddLinkToPivatol = true
  }

  if (!this.shouldChangeStateToDeliveredOnMerge) {
    this.shouldChangeStateToDeliveredOnMerge = true
  }

  next();
});

var Repo = mongoose.model('Repo', repoSchema);

module.exports = Repo;
