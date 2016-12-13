import React from 'react';
import { mount } from 'enzyme';
import expect, { createSpy } from 'expect';

import Dialog from './Dialog';

describe('<Dialog />', () => {
  let dialog, closeSpy, actionSpy;

  beforeEach(() => {
    closeSpy = createSpy();
    actionSpy = createSpy();
    dialog = mount(
      <Dialog
        active
        actions={['Submit', 'Cancel']}
        onClose={closeSpy}
        onActionClick={actionSpy}
      >
        <p>Here is some content that I would like to display</p>
      </Dialog>
    );
  });
  it('shows/hides when active/inactive', () => {
    expect(dialog.find('.weave-dialog').hasClass('active')).toBe(true);
    dialog.find('.weave-dialog-close > span').simulate('click');
    expect(closeSpy).toHaveBeenCalled();
    dialog.setProps({active: false});
    expect(dialog.find('.weave-dialog').hasClass('active')).toBe(false);
  });
  it('runs the action-click handler', () => {
    dialog.findWhere(el => el.text() === 'Submit').first().simulate('click');
    expect(actionSpy).toHaveBeenCalledWith('Submit');
    dialog.findWhere(el => el.text() === 'Cancel').first().simulate('click');
    expect(actionSpy).toHaveBeenCalledWith('Cancel');
  });
  it('allows for React elements to be used for actions', () => {
    const newSpy = createSpy();
    const Action1 = () => (
      <div className="user-action" onClick={newSpy} />
    );
    dialog.setProps({ actions: [<Action1 />] });
    dialog.find('.user-action').simulate('click');
    expect(newSpy).toHaveBeenCalled();
  });
});
