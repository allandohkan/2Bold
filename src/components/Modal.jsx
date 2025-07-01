import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  message, 
  image,
  buttonText = 'Voltar'
}) => {
  const [show, setShow] = useState(isOpen);
  const [fadeClass, setFadeClass] = useState('');
  const timeoutRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setFadeClass(''); // começa sem fade-in
      // Aplica fade-in após o elemento estar no DOM
      setTimeout(() => {
        setFadeClass('fade-in');
      }, 10); // pequeno delay para garantir o reflow
    } else if (show) {
      setFadeClass('fade-out');
      timeoutRef.current = setTimeout(() => {
        setShow(false);
      }, 300); // tempo igual ao da animação
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={`modal-overlay ${fadeClass}`}>
      <div className="modal-content">
        <div className="modal-header">
          {image && <img src={image} alt="Error" />}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-button" 
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  image: PropTypes.string,
  buttonText: PropTypes.string
};

export default Modal; 