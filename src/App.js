import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./App.css";

// Defined as a constant outside the component for better performance.
const initialItems = [
    { name: "Шарик", gender: "Мальчик", age: "2 года", photo: "https://placedog.net/300/200?id=1", description: "Ласковый и игривый пёс", sterilized: true, litterTrained: true, additional: "Любит долгие прогулки." },
    { name: "Мурка", gender: "Девочка", age: "1 год", photo: "https://placedog.net/300/200?id=2", description: "Осторожная и спокойная кошка", sterilized: true, litterTrained: true, additional: "Предпочитает тишину и покой." },
    { name: "Томми", gender: "Мальчик", age: "3 года", photo: "https://placedog.net/300/200?id=3", description: "Очень активный и любящий", sterilized: false, litterTrained: true, additional: "Нуждается в активных играх." },
    { name: "Ляля", gender: "Девочка", age: "4 года", photo: "https://placedog.net/300/200?id=4", description: "Заботливая и нежная", sterilized: true, litterTrained: true, additional: "Идеальна для семьи с детьми." },
    { name: "Бобик", gender: "Мальчик", age: "5 лет", photo: "https://placedog.net/300/200?id=5", description: "Требует внимания и любви", sterilized: false, litterTrained: false, additional: "Проходит курс дрессировки." },
    { name: "Рекс", gender: "Мальчик", age: "6 лет", photo: "https://placedog.net/300/200?id=6", description: "Ласковый и защитник", sterilized: true, litterTrained: true, additional: "Отличный охранник." },
    { name: "Чарли", gender: "Мальчик", age: "1 год", photo: "https://placedog.net/300/200?id=7", description: "Любит играть с детьми", sterilized: false, litterTrained: true, additional: "Очень дружелюбный." },
    { name: "Джессика", gender: "Девочка", age: "2 года", photo: "https://placedog.net/300/200?id=8", description: "Спокойная и нежная", sterilized: true, litterTrained: true, additional: "Любит спать на коленях." }
];

const App = () => {
  // State for pets
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState({
    name: "", gender: "Мальчик", age: "", photo: "", description: "",
    sterilized: false, litterTrained: false, additional: ""
  });
  const [showItemDetails, setShowItemDetails] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // State for carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [images, setImages] = useState([
    { url: "https://placedog.net/500/400", title: "Собака", description: "Описание собаки" },
    { url: "https://placebear.com/400/300", title: "Медведь", description: "Описание медведя" },
  ]);
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });
  
  // State for contacts
  const [contacts, setContacts] = useState({ phone: "8-800-555-35-35", requisites: "ИНН 1234567890" });

  // Pet handlers
  const addItem = () => {
    if (newItem.name && newItem.gender && newItem.age && newItem.description) {
      const itemToAdd = { ...newItem, photo: newItem.photo || "https://placedog.net/300/200" };
      setItems([itemToAdd, ...items]);
      setNewItem({
        name: "", gender: "Мальчик", age: "", photo: "", description: "",
        sterilized: false, litterTrained: false, additional: ""
      });
      setShowNewForm(false);
    }
  };

  const handleItemInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewItem(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const removeItemByIndex = (indexToRemove) => {
    setItems(items.filter((_, idx) => idx !== indexToRemove));
    setShowItemDetails(null);
  };

  const visibleItems = showAll ? items : items.slice(0, 7);

  // Carousel handlers
  const next = () => setCarouselIndex((carouselIndex + 1) % images.length);
  const prev = () => setCarouselIndex((carouselIndex - 1 + images.length) % images.length);

  const handleNewCarouselImageInput = (e) => {
    const { name, value } = e.target;
    setNewImage({ ...newImage, [name]: value });
  };

  const addCarouselItem = () => {
    if (newImage.url && newImage.title) {
      setImages([newImage, ...images]);
      setNewImage({ url: "", title: "", description: "" });
    }
  };

  const removeImageFromCarousel = (indexToRemove) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    setImages(newImages);
    if (newImages.length === 0) {
      setCarouselIndex(0);
      return;
    }
    if (carouselIndex >= indexToRemove) {
      setCarouselIndex(prevIndex => (prevIndex - 1 + newImages.length) % newImages.length);
    }
  };

  return (
    <div className="container">
      <h1 className="main-title">Административная панель управления</h1>

      <section>
        <h2 className="section-title">Наши питомцы</h2>
        <div className="pets-grid">
          <AddPetCard onClick={() => setShowNewForm(true)} />
          {visibleItems.map((item, index) => (
            <PetCard
              key={index}
              item={item}
              onCardClick={() => setShowItemDetails(index)}
              onRemoveClick={(e) => {
                e.stopPropagation();
                removeItemByIndex(index);
              }}
            />
          ))}
        </div>
        {items.length > 7 && (
          <button onClick={() => setShowAll(!showAll)} className="show-more-btn">
            {showAll ? "Свернуть" : "Показать ещё"}
          </button>
        )}
      </section>
      
      <Gallery
        images={images}
        currentIndex={carouselIndex}
        onNext={next}
        onPrev={prev}
        onRemove={removeImageFromCarousel}
        newImage={newImage}
        onNewImageChange={handleNewCarouselImageInput}
        onAddImage={addCarouselItem}
      />
      
      <Contacts contacts={contacts} setContacts={setContacts} />

      {showItemDetails !== null && (
        <PetDetailsModal
          item={items[showItemDetails]}
          onClose={() => setShowItemDetails(null)}
        />
      )}

      {showNewForm && (
        <AddPetFormModal
          newItem={newItem}
          onInputChange={handleItemInput}
          onImageUpload={handleImageUpload}
          onRemovePhoto={() => setNewItem(prev => ({ ...prev, photo: "" }))}
          onAdd={addItem}
          onClose={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
};

// --- Child Components ---

const PetCard = ({ item, onCardClick, onRemoveClick }) => (
  <div className="pet-card" onClick={onCardClick}>
    <button onClick={onRemoveClick} className="remove-btn pet-card-remove-btn">
      <FaTimes />
    </button>
    <img src={item.photo} alt={item.name} className="pet-card-img" />
    <p><strong>Имя:</strong> {item.name}</p>
    <p><strong>Пол:</strong> {item.gender}</p>
    <p><strong>Возраст:</strong> {item.age}</p>
  </div>
);

const AddPetCard = ({ onClick }) => (
  <div className="add-pet-card" onClick={onClick}>
    <FaPlus size={40} />
  </div>
);

const Gallery = ({ images, currentIndex, onNext, onPrev, onRemove, newImage, onNewImageChange, onAddImage }) => (
  <section>
    <h2 className="section-title">Галерея</h2>
    <div className="gallery">
      <button onClick={onPrev} className="gallery-arrow"><FaArrowLeft size={24} /></button>
      <div className="gallery-slide">
        {images.length > 0 ? (
          <>
            <div className="gallery-img-container">
              <img src={images[currentIndex].url} alt={images[currentIndex].title} className="gallery-img" />
              <button onClick={() => onRemove(currentIndex)} className="remove-btn gallery-remove-btn">
                <FaTimes />
              </button>
            </div>
            <div className="gallery-description">
              <h3>{images[currentIndex].title}</h3>
              <p>{images[currentIndex].description}</p>
            </div>
          </>
        ) : (
          <div className="gallery-empty">Галерея пуста</div>
        )}
      </div>
      <button onClick={onNext} className="gallery-arrow"><FaArrowRight size={24} /></button>
    </div>
    <div className="form-container">
      <h3>Добавить изображение в карусель</h3>
      <input name="url" placeholder="URL картинки" value={newImage.url} onChange={onNewImageChange} className="form-input" />
      <input name="title" placeholder="Заголовок" value={newImage.title} onChange={onNewImageChange} className="form-input" />
      <textarea name="description" placeholder="Описание" value={newImage.description} onChange={onNewImageChange} className="form-textarea" rows="3" />
      <button onClick={onAddImage} className="action-button">Добавить в карусель</button>
    </div>
  </section>
);

const Contacts = ({ contacts, setContacts }) => (
  <section className="form-container">
    <h2 className="section-title">Контакты</h2>
    <div className="contact-field">
      <label>Телефон:</label>
      <input value={contacts.phone} onChange={(e) => setContacts({ ...contacts, phone: e.target.value })} className="form-input" />
    </div>
    <div className="contact-field">
      <label>Реквизиты:</label>
      <input value={contacts.requisites} onChange={(e) => setContacts({ ...contacts, requisites: e.target.value })} className="form-input" />
    </div>
  </section>
);

const PetDetailsModal = ({ item, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
      <div className="modal-img-container">
        <img src={item.photo} alt={item.name} className="modal-img" />
      </div>
      <div className="modal-details">
        <h3>{item.name}</h3>
        <p><strong>Пол:</strong> {item.gender}</p>
        <p><strong>Возраст:</strong> {item.age}</p>
        <p><strong>Описание:</strong> {item.description}</p>
        <div className="pet-options">
          <p><strong>Стерилизован:</strong> {item.sterilized ? "Да" : "Нет"}</p>
          <p><strong>К лотку приучен:</strong> {item.litterTrained ? "Да" : "Нет"}</p>
        </div>
        <p><strong>Дополнительно:</strong> {item.additional}</p>
      </div>
    </div>
  </div>
);

const AddPetFormModal = ({ newItem, onInputChange, onImageUpload, onRemovePhoto, onAdd, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        <div className="modal-img-upload-container">
          {newItem.photo ? (
            <>
              <img src={newItem.photo} alt="Предпросмотр" className="modal-img" />
              <button onClick={onRemovePhoto} className="remove-btn image-preview-remove-btn"><FaTimes /></button>
            </>
          ) : (
            <>
              <FaPlus size={80} color="#9ca3af" />
              <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
            </>
          )}
        </div>
        <div className="modal-details">
          <input name="name" placeholder="Имя" value={newItem.name} onChange={onInputChange} className="form-input" />
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Мальчик" checked={newItem.gender === "Мальчик"} onChange={onInputChange} /> Мальчик</label>
            <label><input type="radio" name="gender" value="Девочка" checked={newItem.gender === "Девочка"} onChange={onInputChange} /> Девочка</label>
          </div>
          <input name="age" placeholder="Возраст" value={newItem.age} onChange={onInputChange} className="form-input" />
          <input name="description" placeholder="Главная черта характера" value={newItem.description} onChange={onInputChange} className="form-input" />
          <div className="checkbox-group">
            <label><input type="checkbox" name="sterilized" checked={newItem.sterilized} onChange={onInputChange} /> Стерилизован</label>
            <label><input type="checkbox" name="litterTrained" checked={newItem.litterTrained} onChange={onInputChange} /> Приучен к лотку</label>
          </div>
          <textarea name="additional" placeholder="Дополнительная информация" value={newItem.additional} onChange={onInputChange} className="form-textarea" />
          <button onClick={onAdd} className="action-button success-button">Добавить питомца</button>
        </div>
      </div>
    </div>
);

export default App;