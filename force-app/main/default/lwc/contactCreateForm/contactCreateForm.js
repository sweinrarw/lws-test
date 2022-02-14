import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { reduceErrors } from 'c/ldsUtils';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class ContactCreateForm extends NavigationMixin(
  LightningElement
) {
  @api recordId;

  contactObj = CONTACT_OBJECT;
  newRecordId;

  handleSubmit(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    fields.AccountId = this.recordId;
    this.template.querySelector('lightning-record-edit-form').submit(fields);
  }

  handleSuccess(event) {
    this.newRecordId = event.detail.id;
    this.dispatchSuccessToast();
    this.handleNavToRecord();
  }

  handleError(event) {
    this.dispatchToastErr(event);
  }

  handleNavToRecord() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.newRecordId,
        objectApiName: CONTACT_OBJECT.objectApiName,
        actionName: 'view'
      }
    });
  }

  dispatchSuccessToast() {
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Record created',
        message: 'record created successfully',
        variant: 'success'
      })
    );
  }

  dispatchToastErr(error) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Error creating record',
        message: reduceErrors(error).join(', '),
        variant: 'error'
      })
    );
  }
}
