import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa";
import "./App.css";

// --- API Configuration ---
const BASE_API_URL = 'http://localhost:8080';
const PETS_API_URL = `${BASE_API_URL}/api/pets`;
const EVENTS_API_URL = `${BASE_API_URL}/api/events`;

// Главный компонент приложения
const App = () => {
    // --- Состояние для питомцев ---
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "", gender: "Мальчик", age: "", description: "",
        health: "", sterilized: false, tray: false, 
        photoFile: null, 
        photoPreviewUrl: null 
    });
    const [showItemDetails, setShowItemDetails] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // --- Состояние для мероприятий (Галерея) ---
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [images, setImages] = useState([]); 
    const [showEventDetails, setShowEventDetails] = useState(null); // НОВОЕ: Для редактирования мероприятия
    
    // Состояние для добавления мероприятия через модалку
    const [newEvent, setNewEvent] = useState({ 
        title: "", 
        description: "", 
        imageFile: null 
    });
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    
    // --- Состояние для контактов ---
    const [contacts, setContacts] = useState({ phone: "8-800-555-35-35", requisites: "ИНН 1234567890" });
    
    // ====================================================================
    // === CRUD Функции для ПИТОМЦЕВ ======================================
    // ====================================================================

    // 1. (Read) Загрузка питомцев с сервера
    const loadPets = () => {
        fetch(PETS_API_URL)
            .then(response => response.json())
            .then(data => {
                const petsWithFullPhotoPath = data.map(pet => ({
                    ...pet,
                    photo: pet.photo ? `${BASE_API_URL}${pet.photo}` : 'https://placedog.net/300/200' 
                }));
                setItems(petsWithFullPhotoPath.reverse());
            })
            .catch(error => console.error("Ошибка при загрузке питомцев:", error));
    };
    
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
        
        if (newItem.photoFile) { 
            formData.append('photo', newItem.photoFile);
        }

        fetch(PETS_API_URL, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(() => {
            setShowNewForm(false);
            setNewItem({
                name: "", gender: "Мальчик", age: "", description: "",
                health: "", sterilized: false, tray: false, photoFile: null, photoPreviewUrl: null
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
        
        fetch(`${PETS_API_URL}/${id}`, {
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
        fetch(`${PETS_API_URL}/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            setShowItemDetails(null);
            loadPets();
        })
        .catch(error => console.error("Ошибка при удалении питомца:", error));
    };

    // --- Вспомогательные функции для питомцев ---
    const handleItemInput = (e) => {
        const { name, value, type, checked } = e.target;
        setNewItem({ ...newItem, [name]: type === "checkbox" ? checked : value });
    };
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItem(prev => ({ 
                ...prev, 
                photoFile: file, 
                photoPreviewUrl: URL.createObjectURL(file) 
            }));
        }
    };
    
    // ====================================================================
    // === CRUD Функции для МЕРОПРИЯТИЙ (Event) ===========================
    // ====================================================================
    
    // 1. (Read) Загрузка мероприятий с сервера
    const loadEvents = () => {
        fetch(EVENTS_API_URL)
            .then(res => res.json())
            .then(data => {
                const eventsData = data.map(event => ({
                    id: event.id,
                    url: `${BASE_API_URL}${event.image}`, 
                    title: event.title,
                    description: event.description,
                }));
                // Мероприятия приходят от новых к старым, сохраняем порядок
                setImages(eventsData); 
                if (eventsData.length > 0) setCarouselIndex(0);
            })
            .catch(error => console.error("Ошибка при загрузке мероприятий:", error));
    };
    
    // 2. (Create) Добавление нового мероприятия
    const addEvent = () => {
        if (!newEvent.title || !newEvent.imageFile) {
            alert("Заголовок, фото и описание мероприятия обязательны!");
            return;
        }

        const formData = new FormData();
        formData.append('title', newEvent.title);
        formData.append('description', newEvent.description);
        formData.append('image', newEvent.imageFile); 

        fetch(EVENTS_API_URL, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(() => {
            setNewEvent({ title: "", description: "", imageFile: null });
            setShowNewEventForm(false);
            loadEvents(); 
        })
        .catch(error => {
            console.error("Ошибка при добавлении мероприятия:", error);
            alert("Ошибка при добавлении мероприятия. Проверьте консоль.");
        });
    };
    
    // 3. (Update) Обновление мероприятия (НОВАЯ ФУНКЦИЯ)
    const updateEvent = (id, updatedData, imageFile) => {
        const formData = new FormData();
        formData.append('title', updatedData.title);
        formData.append('description', updatedData.description);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        fetch(`${EVENTS_API_URL}/${id}`, {
            method: 'PUT',
            body: formData,
        })
        .then(res => res.json())
        .then(() => {
            setShowEventDetails(null); 
            loadEvents(); 
        })
        .catch(error => console.error("Ошибка при обновлении мероприятия:", error));
    };
    
    // 4. (Delete) Удаление мероприятия
    const removeEvent = (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить это мероприятие?")) return;

        fetch(`${EVENTS_API_URL}/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            loadEvents(); 
        })
        .catch(error => console.error("Ошибка при удалении мероприятия:", error));
    };

    // --- Handlers для Галереи ---
    
    const handleNewEventInput = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleNewEventImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEvent(prev => ({ ...prev, imageFile: file }));
        }
    };
    
    // Функция для удаления, которая мапит индекс карусели на ID
    const removeImageFromCarousel = (indexToRemove) => {
        if (images[indexToRemove]) {
            removeEvent(images[indexToRemove].id);
        }
    };

    // --- useEffect (обновление) ---
    useEffect(() => {
        loadPets();
        loadEvents(); 
    }, []);

    const visibleItems = showAll ? items : items.slice(0, 7);
    const next = () => setCarouselIndex((carouselIndex + 1) % images.length);
    const prev = () => setCarouselIndex((carouselIndex - 1 + images.length) % images.length);

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
            
            {/* Секция Галерея (ОБНОВЛЕННЫЙ ВЫЗОВ) */}
            <Gallery
                images={images}
                currentIndex={carouselIndex}
                onNext={next}
                onPrev={prev}
                onRemove={removeImageFromCarousel} 
                onEdit={(event) => setShowEventDetails(event)} // НОВОЕ: для открытия модалки редактирования
                onAddClick={() => setShowNewEventForm(true)}
            />
            
            {/* Секция Контакты */}
            <Contacts contacts={contacts} setContacts={setContacts} />

            {/* Модальное окно РЕДАКТИРОВАНИЯ ПИТОМЦА */}
            {showItemDetails && (
                <PetDetailsModal
                    item={showItemDetails}
                    onClose={() => setShowItemDetails(null)}
                    onSave={handleUpdateItem} 
                    onDelete={() => {
                        if (window.confirm(`Вы уверены, что хотите удалить ${showItemDetails.name}?`)) {
                            removeItem(showItemDetails.id);
                        }
                    }}
                />
            )}

            {/* Модальное окно ДОБАВЛЕНИЯ ПИТОМЦА */}
            {showNewForm && (
                <AddPetFormModal
                    newItem={newItem}
                    onInputChange={handleItemInput}
                    onImageUpload={handleImageUpload}
                    onRemovePhoto={() => setNewItem(prev => ({ ...prev, photoFile: null, photoPreviewUrl: null }))}
                    onAdd={addItem}
                    onClose={() => setShowNewForm(false)}
                />
            )}

            {/* Модальное окно ДОБАВЛЕНИЯ МЕРОПРИЯТИЯ */}
            {showNewEventForm && (
                <AddEventFormModal
                    newEvent={newEvent}
                    onInputChange={handleNewEventInput}
                    onImageUpload={handleNewEventImageUpload}
                    onRemovePhoto={() => setNewEvent(prev => ({ ...prev, imageFile: null }))}
                    onAdd={addEvent}
                    onClose={() => setShowNewEventForm(false)}
                />
            )}
            
            {/* НОВОЕ: Модальное окно РЕДАКТИРОВАНИЯ МЕРОПРИЯТИЯ */}
            {showEventDetails && (
                <EventDetailsModal
                    event={showEventDetails}
                    onClose={() => setShowEventDetails(null)}
                    onSave={updateEvent} 
                    onDelete={(id) => {
                        if (window.confirm(`Вы уверены, что хотите удалить мероприятие?`)) {
                            removeEvent(id);
                            setShowEventDetails(null); // Закрыть модалку после удаления
                        }
                    }}
                />
            )}
        </div>
    );
};

// --- Дочерние компоненты ---

const PetCard = ({ item, onCardClick, onRemoveClick }) => (
    <div className="pet-card" onClick={onCardClick}>
        <button onClick={onRemoveClick} className="remove-btn pet-card-remove-btn">
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

// --- ОБНОВЛЕННЫЙ КОМПОНЕНТ ГАЛЕРЕИ ---
const Gallery = ({ images, currentIndex, onNext, onPrev, onRemove, onEdit, onAddClick }) => (
    <section>
        <h2 className="section-title">Галерея мероприятий</h2>
        <div className="gallery">
            <button onClick={onPrev} className="gallery-arrow" disabled={images.length <= 1}><FaArrowLeft size={24} /></button>
            <div className="gallery-slide">
                {images.length > 0 ? (
                    <>
                        {/* ИЗМЕНЕНИЕ: onEdit вызывается при клике на контейнер */}
                        <div className="gallery-img-container" onClick={() => onEdit(images[currentIndex])}>
                            <img src={images[currentIndex].url} alt={images[currentIndex].title} className="gallery-img" />
                            {/* ИЗМЕНЕНИЕ: иконка корзины (FaTrash) и предотвращение всплытия клика */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    onRemove(currentIndex);
                                }} 
                                className="remove-btn gallery-remove-btn"
                            >
                                <FaTrash />
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
            <button onClick={onNext} className="gallery-arrow" disabled={images.length <= 1}><FaArrowRight size={24} /></button>
        </div>
        <button onClick={onAddClick} className="action-button success-button" style={{ marginTop: '20px' }}>
            <FaPlus style={{ marginRight: '5px' }}/> Добавить мероприятие
        </button>
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

// Модальное окно ДЕТАЛЕЙ ПИТОМЦА (остается без изменений)
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
                
                <div className="modal-img-upload-container">
                    <img src={photoPreview} alt={editData.name} className="modal-img" />
                </div>
                
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
                    
                    <label>Состояние здоровья:</label>
                    <input name="description" value={editData.description} onChange={handleInputChange} className="form-input" />
                    
                    <label>Описание характера питомца:</label>
                    <textarea name="health" value={editData.health || ''} onChange={handleInputChange} className="form-textarea" />

                    <div className="checkbox-group">
                        <label><input type="checkbox" name="sterilized" checked={editData.sterilized} onChange={handleInputChange} /> Стерилизован</label>
                        <label><input type="checkbox" name="tray" checked={editData.tray} onChange={handleInputChange} /> Приучен к лотку</label>
                    </div>

                    <div className="modal-actions">

                        <div style={{marginBottom: '2em', marginTop: '2em'}}>
                            <label htmlFor="photo-upload-edit" className="action-button default-button file-upload-button">
                                {newPhotoFile ? `Фото: ${newPhotoFile.name}` : 'Изменить фото'}
                                <input 
                                    id="photo-upload-edit" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none'}} 
                                />
                            </label>
                        </div>

                        <button onClick={handleSaveClick} className="action-button success-button" style={{marginRight: '1em'}}>
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

// Модальное окно ДОБАВЛЕНИЯ ПИТОМЦА (остается без изменений)
const AddPetFormModal = ({ newItem, onInputChange, onImageUpload, onRemovePhoto, onAdd, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
            
            <div className="modal-img-upload-container">
                {newItem.photoFile ? (
                    <>
                        <img src={newItem.photoPreviewUrl} alt="Предпросмотр" className="modal-img" />
                        <button onClick={onRemovePhoto} className="remove-btn image-preview-remove-btn"><FaTimes /></button>
                    </>
                ) : (
                    <>
                        <FaPlus size={80} color="#9ca3af" />
                        <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
                    </>
                )}
                {newItem.photoFile && <p style={{marginTop: '10px'}}>Выбран файл: {newItem.photoFile.name}</p>}
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


// --- ОБНОВЛЕННЫЙ КОМПОНЕНТ: Модальное окно ДОБАВЛЕНИЯ МЕРОПРИЯТИЯ ---
const AddEventFormModal = ({ newEvent, onInputChange, onImageUpload, onRemovePhoto, onAdd, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
        
        {/* ИЗМЕНЕНИЕ: Убран h3 заголовок */}
        
        {/* Загрузка фото */}
        <div className="modal-img-upload-container">
          {newEvent.imageFile ? (
            <>
              <img src={URL.createObjectURL(newEvent.imageFile)} alt="Предпросмотр" className="modal-img" />
              <button onClick={onRemovePhoto} className="remove-btn image-preview-remove-btn"><FaTimes /></button>
            </>
          ) : (
            <>
              <FaPlus size={80} color="#9ca3af" />
              <input type="file" accept="image/*" onChange={onImageUpload} className="image-upload-input" />
            </>
          )}
          {newEvent.imageFile && <p style={{marginTop: '10px'}}>Выбран файл: {newEvent.imageFile.name}</p>}
        </div>
        
        {/* Поля для данных */}
        <div className="modal-details">
          <input name="title" placeholder="Заголовок мероприятия" value={newEvent.title} onChange={onInputChange} className="form-input" />
          <textarea name="description" placeholder="Описание мероприятия" value={newEvent.description} onChange={onInputChange} className="form-textarea" rows="3" />
          <button onClick={onAdd} className="action-button success-button">Создать мероприятие</button>
        </div>
      </div>
    </div>
);

// --- НОВЫЙ КОМПОНЕНТ: Модальное окно РЕДАКТИРОВАНИЯ МЕРОПРИЯТИЯ ---
const EventDetailsModal = ({ event, onClose, onSave, onDelete }) => {
    const [editData, setEditData] = useState({ title: event.title, description: event.description });
    const [newPhotoFile, setNewPhotoFile] = useState(null);

    useEffect(() => {
        setEditData({ title: event.title, description: event.description });
        setNewPhotoFile(null); 
    }, [event]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewPhotoFile(e.target.files[0]);
    };

    const handleSaveClick = () => {
        onSave(event.id, editData, newPhotoFile);
    };

    const handleDeleteClick = () => {
        onDelete(event.id);
    };

    let photoPreview = event.url; 
    if (newPhotoFile) {
        photoPreview = URL.createObjectURL(newPhotoFile);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="remove-btn modal-close-btn"><FaTimes /></button>
                
                <div className="modal-img-upload-container">
                    <img src={photoPreview} alt={editData.title} className="modal-img" />
                </div>
                
                <div className="modal-details">
                    <h3>Редактирование мероприятия</h3>

                    <label>Заголовок:</label>
                    <input name="title" value={editData.title} onChange={handleInputChange} className="form-input" />
                    
                    <label>Описание:</label>
                    <textarea name="description" value={editData.description} onChange={handleInputChange} className="form-textarea" rows="4" />
                    
                    <div className="modal-actions">

                        <div style={{marginBottom: '2em', marginTop: '2em'}}>
                            <label htmlFor="photo-upload-edit-event" className="action-button default-button file-upload-button">
                                {newPhotoFile ? `Фото: ${newPhotoFile.name}` : 'Изменить фото'}
                                <input 
                                    id="photo-upload-edit-event" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    style={{ display: 'none'}} 
                                />
                            </label>
                        </div>

                        <button onClick={handleSaveClick} className="action-button success-button" style={{marginRight: '1em'}}>
                            Сохранить
                        </button>
                        
                        <button onClick={handleDeleteClick} className="action-button danger-button">
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;