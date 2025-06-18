import PropTypes from 'prop-types';
import './Modal.scss';

const Modal = ({ 
  isOpen, 
  onClose, 
  message, 
  image,
  buttonText = 'Voltar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
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