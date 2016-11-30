import React from 'react';

const Hopup = ({children, onClose, active}) => (
  <dialog className={active ? 'weave-hopup active' : 'weave-hopup'}>
    <div className="weave-hopup-close">
      <a
        href=""
        onClick={onClose}
      >
        Close
      </a>
    </div>
    {children}
  </dialog>
);

Hopup.propTypes = {
  onClose: React.PropTypes.func,
  active: React.PropTypes.bool
};

export default Hopup;
