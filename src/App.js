import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./App.css";


const App = () => {
  // --- Состояние для питомцев ---
  // Начальное состояние - пустой массив.
  const [items, setItems] = useState([]);
  
  const [newItem, setNewItem] = useState({
    name: "", gender: "Мальчик", age: "", description: "",
    health: "", sterilized: false, tray: false, 
    // Photo теперь хранит сам файл. Начинаем с null.
    photo: null 
  });
  const [showItemDetails, setShowItemDetails] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // --- Состояние для галереи и контактов ---
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [images, setImages] = useState([
    { url: "https://placedog.net/500/400", title: "Собака", description: "Описание собаки" },
    { url: "https://placebear.com/400/300", title: "Медведь", description: "Описание медведя" },
  ]);
  const [newImage, setNewImage] = useState({ url: "", title: "", description: "" });
  const [contacts, setContacts] = useState({ phone: "8-800-555-35-35", requisites: "ИНН 1234567890" });
  
  // URL нашего API
  const API_URL = 'http://localhost:8080/api/pets';

  // Функция для загрузки питомцев с сервера
  const loadPets = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        // Сервер отдает относительный путь к фото, мы добавляем к нему адрес сервера
        const petsWithFullPhotoPath = data.map(pet => ({
            ...pet,
            photo: pet.photo ? `http://localhost:8080${pet.photo}` : 'https://placedog.net/300/200' // Фото по умолчанию, если его нет
        }));
        setItems(petsWithFullPhotoPath.reverse()); // Новые питомцы будут сверху
      })
      .catch(error => console.error("Ошибка при загрузке питомцев:", error));
  };
  
  // Используем useEffect для загрузки данных при первом рендере компонента
  useEffect(() => {
    loadPets();
  }, []);


  // Функция добавления питомца теперь отправляет данные на сервер
  const addItem = () => {
    // Создаем FormData для отправки файла и данных
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('age', newItem.age);
    formData.append('gender', newItem.gender);
    formData.append('health', newItem.health);
    formData.append('description', newItem.description);
    formData.append('sterilized', newItem.sterilized);
    formData.append('tray', newItem.tray);
    if (newItem.photo) {
      formData.append('photo', newItem.photo); // Добавляем файл
    }

    fetch(API_URL, {
      method: 'POST',
      body: formData, // Отправляем FormData
    })
    .then(response => response.json())
    .then(() => {
      // После успешного добавления:
      setShowNewForm(false); // Закрываем форму
      setNewItem({ // Очищаем форму
        name: "", gender: "Мальчик", age: "", description: "",
        health: "", sterilized: false, tray: false, photo: null
      });
      loadPets(); // Перезагружаем список питомцев с сервера
    })
    .catch(error => console.error("Ошибка при добавлении питомца:", error));
  };

  const handleItemInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
  };
  
  // Загрузка изображения теперь сохраняет сам файл, а не data URL
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({ ...prev, photo: file }));
    }
  };

  // Функция удаления теперь работает по ID и отправляет запрос на сервер
  const removeItem = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      setShowItemDetails(null); // Закрываем модальное окно, если было открыто
      loadPets(); // Перезагружаем список питомцев
    })
    .catch(error => console.error("Ошибка при удалении питомца:", error));
  };

  const visibleItems = showAll ? items : items.slice(0, 7);

  // --- Carousel and Contact handlers ---
  const next = () => setCarouselIndex((carouselIndex + 1) % images.length);
  const prev = () => setCarouselIndex((carouselIndex - 1 + images.length) % images.length);
  const handleNewCarouselImageInput = (e) => { /* ... */ };
  const addCarouselItem = () => { /* ... */ };
  const removeImageFromCarousel = (indexToRemove) => { /* ... */ };

  return (
    <div className="container">
      <h1 className="main-title">Административная панель управления</h1>

      <section>
        <h2 className="section-title">Наши питомцы</h2>
        <div className="pets-grid">
          <AddPetCard onClick={() => setShowNewForm(true)} />
          {visibleItems.map((item) => ( // убрали index
            <PetCard
              key={item.id} // Используем уникальный id из базы данных
              item={item}
              onCardClick={() => setShowItemDetails(item)} // Передаем весь объект
              onRemoveClick={(e) => {
                e.stopPropagation();
                removeItem(item.id); // Удаляем по id
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

      {/* Логика отображения модального окна стала проще */ }
      {showItemDetails && (
        <PetDetailsModal
          item={showItemDetails}
          onClose={() => setShowItemDetails(null)}
        />
      )}

      {showNewForm && (
        <AddPetFormModal
          newItem={newItem}
          onInputChange={handleItemInput}
          onImageUpload={handleImageUpload}
          onAdd={addItem}
          onClose={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
};


// --- Дочерние компоненты ---

const PetCard = ({ item, onCardClick, onRemoveClick }) => (
  <div className="pet-card" onClick={onCardClick}>
    <button onClick={onRemoveClick} className="remove-btn pet-card-remove-btn"><FaTimes /></button>
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
      <div className="modal-img-container"><img src={item.photo} alt={item.name} className="modal-img" /></div>
      <div className="modal-details">
        <h3>{item.name}</h3>
        <p><strong>Пол:</strong> {item.gender}</p>
        <p><strong>Возраст:</strong> {item.age}</p>
        <p><strong>Описание:</strong> {item.description}</p>
        {/* Поля, чтобы соответствовать API */}
        <p><strong>Здоровье:</strong> {item.health}</p>
        <div className="pet-options">
          <p><strong>Стерилизован:</strong> {item.sterilized ? "Да" : "Нет"}</p>
          <p><strong>К лотку приучен:</strong> {item.tray ? "Да" : "Нет"}</p>
        </div>
      </div>
    </div>
  </div>
);

// Форма добавления, чтобы соответствовать модели данных
const AddPetFormModal = ({ newItem, onInputChange, onImageUpload, onAdd, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        <div className="modal-img-upload-container">
          {/* Предпросмотр убрали для простоты, т.к. работаем с файлом */}
          <FaPlus size={80} color="#9ca3af" />
          <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
          {newItem.photo && <p>Выбран файл: {newItem.photo.name}</p>}
        </div>
        <div className="modal-details">
          <input name="name" placeholder="Имя" value={newItem.name} onChange={onInputChange} className="form-input" />
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Мальчик" checked={newItem.gender === "Мальчик"} onChange={onInputChange} /> Мальчик</label>
            <label><input type="radio" name="gender" value="Девочка" checked={newItem.gender === "Девочка"} onChange={onInputChange} /> Девочка</label>
          </div>
          <input name="age" placeholder="Возраст (например, 2 года)" value={newItem.age} onChange={onInputChange} className="form-input" />
          <input name="description" placeholder="Состояние здоровья" value={newItem.description} onChange={onInputChange} className="form-input" />
          <textarea name="health" placeholder="Описание черт характера" value={newItem.health} onChange={onInputChange} className="form-textarea" />
          <div className="checkbox-group">
            <label><input type="checkbox" name="sterilized" checked={newItem.sterilized} onChange={onInputChange} /> Стерилизован</label>
            <label><input type="checkbox" name="tray" checked={newItem.tray} onChange={onInputChange} /> Приучен к лотку</label>
          </div>
          <button onClick={onAdd} className="action-button success-button">Добавить питомца</button>
        </div>
      </div>
    </div>
);

export default App;