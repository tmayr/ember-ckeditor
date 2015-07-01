/* globals CKEDITOR */
import Ember from 'ember';
import layout from '../templates/components/ember-ckeditor';

export default Ember.Component.extend({
  layout: layout,
  'on-change': null,

  config: null,
  _editor: null,
  value: null,

  _handleValueChange: Ember.observer('value', function () {
    if (this._editorChanging) {
      return;
    }

    if (this._editor) {
      this._editor.setData(this.get('value'));
    }
  }),

  _handleChange: function (event) {
    this._editorChanging = true;
    try {
      var newValue = event.editor.getData();
      this.set('value', newValue);

      this.sendAction('on-change', {
        event: event,
        data: event.editor.getData()
      });
    } catch (e) {
      Ember.logger.error("Error when handling scrivener change", e);
    } finally {
      this._editorChanging = false;
    }
  },

  didInsertElement() {
    let textarea = this.element.querySelector('.editor');
    let config = this.get('config');
    let editor = this._editor = CKEDITOR.replace(textarea, config);
    this._editor.on('change', this._handleChange.bind(this));
  },

  willDestroyElement() {
    this._editor.destroy();
    this._editor = null;
  }
});
