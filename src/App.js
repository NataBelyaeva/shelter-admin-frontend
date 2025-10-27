import React, { useState, useEffect } from "react";
// ИЗМЕНЕНИЕ: Добавили иконку FaTrash
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import "./App.css";

// Главный компонент приложения
const App = () => {
  // --- Состояние для питомцев ---
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "", gender: "Мальчик", age: "", description: "",
    health: "", sterilized: false, tray: false, photo: null
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
  
  // Адрес нашего бэкенда
  const API_URL = 'http://localhost:8080/api/pets';

  // --- CRUD Функции для ПИТОМЦЕВ ---

  // 1. (Read) Загрузка питомцев с сервера
  const loadPets = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        const petsWithFullPhotoPath = data.map(pet => ({
            ...pet,
            photo: pet.photo ? `http://localhost:8080${pet.photo}` : 'https://placedog.net/300/200'
        }));
        setItems(petsWithFullPhotoPath.reverse());
      })
      .catch(error => console.error("Ошибка при загрузке питомцев:", error));
  };
  
  // Загружаем питомцев один раз при старте
  useEffect(() => {
    loadPets();
  }, []);


  // 2. (Create) Добавление нового питомца
  const addItem = () => {
    const formData = new FormData();
    formData.append('name', newItem.name);
    formData.append('age', newItem.age);
    formData.append('gender', newItem.gender);
    formData.append('health', newItem.health);
    formData.append('description', newItem.description);
    formData.append('sterilized', newItem.sterilized);
    formData.append('tray', newItem.tray);
    if (newItem.photo) {
      formData.append('photo', newItem.photo);
    }

    fetch(API_URL, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(() => {
      setShowNewForm(false);
      setNewItem({
        name: "", gender: "Мальчик", age: "", description: "",
        health: "", sterilized: false, tray: false, photo: null
      });
      loadPets();
    })
    .catch(error => console.error("Ошибка при добавлении питомца:", error));
  };

  // 3. (Update) Обновление питомца
  const handleUpdateItem = (id, updatedData, photoFile) => {
    const formData = new FormData();

    formData.append('name', updatedData.name);
    formData.append('age', updatedData.age);
    formData.append('gender', updatedData.gender);
    formData.append('health', updatedData.health);
    formData.append('description', updatedData.description);
    formData.append('sterilized', updatedData.sterilized);
    formData.append('tray', updatedData.tray);

    if (photoFile) {
      formData.append('photo', photoFile);
    }
    
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData,
    })
    .then(res => res.json())
    .then(() => {
        setShowItemDetails(null); 
        loadPets(); 
    })
    .catch(error => console.error("Ошибка при обновлении питомца:", error));
  };

  // 4. (Delete) Удаление питомца
  const removeItem = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      setShowItemDetails(null);
      loadPets();
    })
    .catch(error => console.error("Ошибка при удалении питомца:", error));
  };

  // --- Вспомогательные функции ---
  const handleItemInput = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({ ...prev, photo: file }));
    }
  };

  const visibleItems = showAll ? items : items.slice(0, 7);

  // --- Handlers для Галереи и Контактов (без изменений) ---
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
    if (newImages.length === 0) setCarouselIndex(0);
    else if (carouselIndex >= indexToRemove) {
      setCarouselIndex(prevIndex => (prevIndex - 1 + newImages.length) % newImages.length);
    }
  };

  // --- Рендер (JSX) ---
  return (
    <div className="container">
      <h1 className="main-title">Административная панель управления</h1>

      {/* Секция Питомцы */}
      <section>
        <h2 className="section-title">Наши питомцы</h2>
        <div className="pets-grid">
          <AddPetCard onClick={() => setShowNewForm(true)} />
          {visibleItems.map((item) => (
            <PetCard
              key={item.id}
              item={item}
              onCardClick={() => setShowItemDetails(item)}
              onRemoveClick={(e) => {
                e.stopPropagation();
                // Добавим подтверждение перед удалением
                if (window.confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
                  removeItem(item.id);
                }
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
      
      {/* Секция Галерея */}
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
      
      {/* Секция Контакты */}
      <Contacts contacts={contacts} setContacts={setContacts} />

      {/* Модальное окно РЕДАКТИРОВАНИЯ */}
      {showItemDetails && (
        <PetDetailsModal
          item={showItemDetails}
          onClose={() => setShowItemDetails(null)}
          onSave={handleUpdateItem} 
          // ИЗМЕНЕНИЕ: Передаем функцию удаления в модальное окно
          onDelete={() => {
             if (window.confirm(`Вы уверены, что хотите удалить ${showItemDetails.name}?`)) {
                removeItem(showItemDetails.id);
             }
          }}
        />
      )}

      {/* Модальное окно ДОБАВЛЕНИЯ */}
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
    <button onClick={onRemoveClick} className="remove-btn pet-card-remove-btn">
      {/* ИЗМЕНЕНИЕ: Заменили иконку на мусорную корзину */}
      <FaTrash />
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


//
// Модальное окно ДЕТАЛЕЙ (Форма Редактирования)
// ИЗМЕНЕНИЕ: Принимает onDelete
//
const PetDetailsModal = ({ item, onClose, onSave, onDelete }) => {
  const [editData, setEditData] = useState({ ...item });
  const [newPhotoFile, setNewPhotoFile] = useState(null);

  useEffect(() => {
    setEditData({ ...item });
    setNewPhotoFile(null); 
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setNewPhotoFile(e.target.files[0]);
  };

  const handleSaveClick = () => {
    onSave(item.id, editData, newPhotoFile);
  };

  let photoPreview = editData.photo; 
  if (newPhotoFile) {
    photoPreview = URL.createObjectURL(newPhotoFile);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        
        {/* Колонка 1: Фото */}
        <div className="modal-img-upload-container">
          <img src={photoPreview} alt={editData.name} className="modal-img" />
          {/* ИЗМЕНЕНИЕ: Поле для смены фото переехало вниз */}
        </div>
        
        {/* Колонка 2: Поля для редактирования */}
        <div className="modal-details">
          <label>Имя:</label>
          <input name="name" value={editData.name} onChange={handleInputChange} className="form-input" />
          
          <label>Пол:</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Мальчик" checked={editData.gender === "Мальчик"} onChange={handleInputChange} /> Мальчик</label>
            <label><input type="radio" name="gender" value="Девочка" checked={editData.gender === "Девочка"} onChange={handleInputChange} /> Девочка</label>
          </div>

          <label>Возраст:</label>
          <input name="age" value={editData.age} onChange={handleInputChange} className="form-input" />
          
          <label>Здоровье:</label>
          <input name="description" value={editData.description} onChange={handleInputChange} className="form-input" />
          
          <label>Описание характера питомца:</label>
          <textarea name="health" value={editData.health || ''} onChange={handleInputChange} className="form-textarea" />

          <div className="checkbox-group">
            <label><input type="checkbox" name="sterilized" checked={editData.sterilized} onChange={handleInputChange} /> Стерилизован</label>
            <label><input type="checkbox" name="tray" checked={editData.tray} onChange={handleInputChange} /> Приучен к лотку</label>
          </div>

        {/* ИЗМЕНЕНИЕ: Блок с кнопками внизу */}
        <div className="modal-actions">
            {/* Кнопка для загрузки фото, стилизованная как action-button */}
            <label htmlFor="photo-upload-edit" className="action-button default-button file-upload-button">
              {newPhotoFile ? `Фото: ${newPhotoFile.name}` : 'Изменить фото'}
              <input 
                id="photo-upload-edit" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none'}} // Скрываем стандартный input
              />
            </label>

            <button onClick={handleSaveClick} className="action-button success-button" style={{marginRight: '1em', marginLeft: '1em'}}>
              Сохранить
            </button>
            
            <button onClick={onDelete} className="action-button danger-button">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// Модальное окно ДОБАВЛЕНИЯ (остается как было)
const AddPetFormModal = ({ newItem, onInputChange, onImageUpload, onAdd, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        <div className="modal-img-upload-container">
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
          <textarea name="health" placeholder="Главная черта характера" value={newItem.health} onChange={onInputChange} className="form-textarea" />
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