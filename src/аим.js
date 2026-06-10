body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.main-title {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.section-title {
  text-align: center;
  margin-bottom: 20px;
}

section {
  margin-bottom: 40px;
}

/* --- Buttons --- */
.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #dc2626;
  padding: 0;
  line-height: 1;
  font-size: 1.2rem;
  z-index: 5;
}

.action-button {
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button-exit {
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  filter: brightness(1.1);
}

.default-button {
  background-color: #6b7280;
  color: white;
}

.success-button {
  background-color: #10b981;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1.1vw;
  margin: 0 0 1vw 0;
  }
  @media (max-width: 767px) {
    margin: 0 0 2vw 0;
    font-size: 3.8vw;
    width: 100%;
  }
}

.danger-button {
  /* НОВОЕ: Красный фон для кнопок "Удалить" */
  background-color: #dc2626; 
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1.1vw;
  }
  @media (max-width: 767px) {
    font-size: 3.8vw;
    width: 100%;
  }
}

.danger-button-exit {
  /* НОВОЕ: Красный фон для кнопок "Удалить" */
  background-color: #dc2626; 
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1.1vw;
  }
  @media (max-width: 767px) {
    font-size: 3.8vw;
    /* width: 100%; */
    /* position: absolute; */
    
  }
}

.show-more-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: block;
  margin: 20px auto 0;
}

/* --- Pet Grid --- */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.pet-card, .add-pet-card {
  position: relative;
  background-color: #ffffff;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.add-pet-card {
  border: 2px dashed #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: #9ca3af;
}

.pet-card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.pet-card p {
  margin: 4px 0;
  font-size: 0.9rem;
}

/* --- Gallery --- */
.gallery {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.gallery-arrow {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.gallery-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.gallery-slide {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-height: 250px;
}

.gallery-img-container {
  position: relative;
  width: 50%;
  height: 250px;
  margin-right: 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 0.2s;
}

.gallery-img-container:hover {
  opacity: 0.9;
}

.gallery-remove-btn {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 8px;
  color: #dc2626;
  top: 15px;
  right: 15px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  line-height: 1;
}

.gallery-remove-btn:hover {
  background-color: white;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.gallery-description {
  flex: 1;
}

.gallery-description h3 {
  margin-top: 0;
}

.gallery-description p {
  color: #6b7280;
  white-space: pre-wrap;
}

.gallery-empty {
  width: 100%;
  text-align: center;
  color: #6b7280;
  font-size: 1.2rem;
}

/* --- Forms & Contacts --- */
.form-container {
  background-color: #f3f4f6;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

.form-input, .form-textarea {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

.contact-field {
  margin-bottom: 15px;
}

.contact-field label {
  display: block;
  margin-bottom: 5px;
}

/* --- Modals --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  background-color: #fff;
  width: 90%;
  max-width: 900px;
  max-height: 600px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.modal-close-btn {
  font-size: 20px;
  z-index: 10;
}

.modal-img-container, .modal-img-upload-container {
  width: 50%;
  height: 100%;
  position: relative;
  background-color: #f3f4f6;
}

.modal-img-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-upload-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-preview-remove-btn {
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  padding: 5px;
  color: #dc2626;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details {
  padding: 30px 40px;
  width: 50%;
  overflow-y: auto;
}

.modal-details p {
  margin: 1vw 0 1vw 0;
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  gap: 10px;
}

.file-upload-button {
  cursor: pointer;
  
@media (min-width: 768px) {
    margin: 0 0 1vw 0;
  font-size: 1.1vw;
  }
  @media (max-width: 767px) {
    margin: 0 0 2vw 0;
    font-size: 3.8vw;
    width: 100%;
     /* display: block; Добавьте это */
    text-align: center;
  }

}

.pet-options, .checkbox-group, .radio-group {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.radio-group label, .checkbox-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* --- Authentication --- */
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 12px;
  background-color: #f3f4f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  box-sizing: border-box;
}

.login-form input {
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-message {
  color: #ef4444;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.logout-button {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

/* --- Tabs --- */
.admin-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e5e7eb;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-tabs button {
  background: none;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  transition: color 0.2s, border-bottom 0.2s;
}

.admin-tabs button:hover {
  color: #1f2937;
}

.admin-tabs .tab-active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  font-weight: 600;
}

/* --- User Management --- */
.user-management-container input {
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.user-action-block {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.user-action-block h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #4b5563;
}

.status-message {
  padding: 10px;
  background-color: #d1fae5;
  border: 1px solid #34d399;
  color: #065f46;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

/* --- Read More Button --- */
.read-more-btn {
  background: #3b82f6;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 6px 12px;
  margin-top: 10px;
  display: inline-block;
}

.read-more-btn:hover {
  background-color: #2563eb;
}

/* --- Full Text Modal --- */
.full-text-modal-content {
  background-color: #fff;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
  box-sizing: border-box;
}

.full-text-modal-content h3 {
  margin-bottom: 20px;
  color: #1f2937;
  font-size: 1.5rem;
  padding-right: 30px;
}

.full-text-modal-image {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.full-text-modal-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}

.full-text-modal-description {
  line-height: 1.6;
  color: #4b5563;
}

.full-text-modal-description p {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* --- Animations --- */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.full-text-modal-content {
  animation: modalFadeIn 0.2s ease-out;
}

/* --- Media Queries for Responsive Design --- */
@media (max-width: 800px) {
  .gallery-slide, .modal-content {
    flex-direction: column;
  }
  
  .gallery-img-container {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .gallery-description {
    padding: 0;
  }
  
  .modal-img-container, .modal-img-upload-container {
    width: 100%;
    height: 200px;
  }
  
  .modal-details {
    width: 100%;
    padding: 20px;
  }
  
  .modal-content {
    height: auto;
    max-height: 90vh;
  }
  
  .admin-tabs {
    gap: 5px;
  }
  
  .admin-tabs button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
  
  .pets-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .main-title {
    font-size: 1.2rem;
    padding-right: 70px;
  }
  
  .logout-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px 10px;
    font-size: 0.8rem;
  }
  
  .admin-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .admin-tabs button {
    flex-shrink: 0;
  }
  
  .modal-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-actions .action-button {
    width: 100%;
    margin: 5px 0;
  }
  
  .gallery-slide {
    margin: 0 10px;
    padding: 15px;
  }
  
  .gallery-arrow {
    padding: 5px;
  }
  
  .read-more-btn {
    display: block;
    margin: 10px auto 0;
    text-align: center;
  }
  
  .form-input, .form-textarea {
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .pet-options, .checkbox-group {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }
  
  .pets-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }
  
  .pet-card-img {
    height: 100px;
  }
  
  .main-title {
    font-size: 1rem;
    padding-right: 60px;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .full-text-modal-content {
    padding: 20px;
  }
  
  .full-text-modal-content h3 {
    font-size: 1.2rem;
  }
}

/* Box sizing for all elements */
* {
  box-sizing: border-box;
}