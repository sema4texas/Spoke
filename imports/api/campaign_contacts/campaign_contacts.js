import { Mongo } from 'meteor/mongo'
import { Factory } from 'meteor/dburles:factory'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { Fake } from 'meteor/anti:fake'
import { SurveyQuestions } from '../survey_questions/survey_questions'
import { SurveyAnswers } from '../survey_answers/survey_answers'
import { Messages } from '../messages/messages'

export const CampaignContacts = new Mongo.Collection('campaign_contacts')

// Deny all client-side updates since we will be using methods to manage this collection
CampaignContacts.deny({
  insert() { return true },
  update() { return true },
  remove() { return true }
})

CampaignContacts.schema = new SimpleSchema({
  // userId: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true },
  campaignId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  cell: { type: String },
  customFields: { type: Object, blackbox: true },
  createdAt: { type: Date },
  assignmentId: {
    type: String,
    optional: true
  }, // so we can tell easily what is unassigned
  campaignSurveyId: {
    type: String,
    optional: true
  }
})

CampaignContacts.attachSchema(CampaignContacts.schema)

CampaignContacts.requiredUploadFields = ['firstName', 'lastName', 'cell']

Factory.define('campaign_contact', CampaignContacts, {
  campaignId: () => Factory.get('campaign'),
  firstName: () => Fake.user({ fields: ['name'] }).name,
  lastName: () => Fake.user({ fields: ['surname'] }).surname,
  state: () => Fake.fromArray(['CA', 'DE', 'MN', 'IL', 'TX', 'NY', 'HI']),
  cell: '669-221-6251',
  customFields: () => {
    const fields = {}
    fields[Fake.word()] = Fake.sentence(2)
    return fields
  },
  createdAt: () => new Date(),
  assignmentId: () => Factory.get('assignment'),
  campaignSurveyId: null
})

// This represents the keys from CampaignContacts objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
CampaignContacts.publicFields = {
}

CampaignContacts.helpers({
  messages() {
    return Messages.find({ contactNumber: this.cell, campaignId: this.campaignId })
  },
  lastMessage() {
    return Messages.findOne({ contactNumber: this.cell, campaignId: this.campaignId }, { sort: { createdAt: -1 }})
  },
  surveyAnswer(surveyQuestionId) {
    console.log("survey question id ", surveyQuestionId, "and campaignContactId", this._id, SurveyAnswers.findOne({
      surveyQuestionId,
      campaignContactId: this._id
    }))

    return SurveyAnswers.findOne({
      surveyQuestionId,
      campaignContactId: this._id
    })
  },
  survey() {
    if (!this.campaignSurveyId) {
      return SurveyQuestions.findOne({ campaignId: this.campaignId, parentAnswer: null})
    }
    return SurveyQuestions.findOne({ _id: this.campaignSurveyId })
  },
})